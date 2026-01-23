const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const cors = require("cors")({ origin: true });
const { GoogleGenerativeAI } = require("@google/generative-ai");

const admin = require("firebase-admin");

let serviceAccount;
try {
	serviceAccount = require("./service-account.json");
} catch (e) {}

if (admin.apps.length === 0) {
	if (serviceAccount) {
		admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
		});
	} else {
		admin.initializeApp();
	}
}
const db = admin.firestore();

// --- FUNÇÃO 1: CONSULTA ---
exports.getInfraction = onRequest((req, res) => {
	cors(req, res, async () => {
		const { code, desdobramento } = req.body || {};
		if (!code) {
			res.status(400).json({ error: "Código obrigatório." });
			return;
		}
		try {
			const suffix = desdobramento ? desdobramento : "0";
			const docId = `${code.trim()}-${suffix.trim()}`;
			const docRef = db.collection("infracoes").doc(docId);
			const doc = await docRef.get();
			if (!doc.exists) {
				res.status(404).json({ error: `Infração ${docId} não encontrada.` });
				return;
			}
			res.status(200).json({
				success: true,
				data: { article: doc.data().artigo, description: doc.data().descricao },
			});
		} catch (error) {
			res.status(500).json({ error: "Erro interno." });
		}
	});
});

// --- FUNÇÃO 2: MANUAL / REFINAMENTO ---
exports.generateDefense = onRequest((req, res) => {
	cors(req, res, async () => {
		const apiKey = process.env.GEMINI_API_KEY;
		if (!apiKey) {
			res.status(500).json({ error: "API Key ausente." });
			return;
		}

		const data = req.body || {};
		const userId = data.userId;

		if (!userId) {
			res.status(401).json({ error: "Usuário não autenticado." });
			return;
		}

		const isRefinement = !!data.refinementInstructions;

		try {
			if (!isRefinement) {
				// Só cobra na geração inicial, não no refinamento (opcional, mas justo)
				// Ou cobre em ambos. O prompt diz "liberar geração", então vou cobrar sempre por enquanto.
				await checkAndDeductCredits(userId);
			}

			const genAI = new GoogleGenerativeAI(apiKey);
			const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

			let systemInstruction = `
        Você é um Advogado Especialista em Direito de Trânsito.
        Tarefa: Redigir o recurso de multa de trânsito técnica e persuasiva.
        
        REGRAS:
        1. Identifique qual fase da defesa é (Defesa Prévia, JARI ou CETRAN) com base no contexto ou solicite se ambíguo, para que o endereçamento e argumentação sejam adequados.
        2. Estrutura: Endereçamento (CAIXA ALTA), Qualificação, Fatos, Direito, Pedido, Local/Data.
        3. A formatação da versão final não deve ser markdown, e sim formatação estética para leitura humana seguindo as boas práticas estéticas e de formatação de recursos administrativos e jurídicos.
        4. Apresentar apenas o recurso, nada mais, sem cumprimento ao usuário, sem sugestões ao final, apenas o documento do recurso pronto para protocolo.
        5. Não adicionar nada sobre advogado ao final do documento, apenas espaço para assinatura do usuário.
        6. Não levar em consideração absoluta o relato do usuário, mas realmente analisar a fundo e ver quais argumentos são válidos para serem utilizados no recurso.
        7. Seja prolixo na defesa explorando a maior quantidade de pontos possível, mas nunca ultrapassando limites racionais ou legais.
        8. Não insira asteríscos ('*') de formatação desnecessários.
        9. No final, adicione: "Nestes termos, pede deferimento. ${data.signCity || "Local"}, ${data.signDate || "Data"}."
      `;

			if (isRefinement) {
				systemInstruction += `\nMODO REFINAMENTO: Reescreva o texto mantendo os dados mas aplicando: "${data.refinementInstructions}".`;
			}

            const defenseTypeMap = { 'previa': 'DEFESA PRÉVIA', 'jari': 'RECURSO À JARI', 'cetran': 'RECURSO AO CETRAN' };
            const defenseTypeLabel = defenseTypeMap[data.defenseType] || 'RECURSO ADMINISTRATIVO';

			const userPrompt = `
        TIPO DE PEÇA: ${defenseTypeLabel}
        CASO: Órgão ${data.issuingBody}, AIT ${data.aitNumber}
        CONDUTOR: ${data.name}, Brasileiro(a), ${data.maritalStatus === "Outro" ? "" : data.maritalStatus}, ${data.profession}, RG ${data.rg} ${data.rgIssuer}, CPF ${data.cpf}. CNH ${data.cnh} Cat ${data.cnhCategory}.
        ENDEREÇO: ${data.address}, ${data.addressNumber} ${data.addressComplement}, ${data.neighborhood}, ${data.city}/${data.state}, CEP ${data.zipCode}.
        VEÍCULO: ${data.plate}/${data.plateUF}, ${data.vehicleModel}.
        INFRAÇÃO: ${data.article} em ${data.date} às ${data.time}, Local ${data.location}.
        EQUIPAMENTO: ${data.equipmentNumber || "N/A"}, Aferição ${data.lastCalibration || "N/A"}.
        
        RELATO: "${data.description}"
        ${isRefinement ? `\nTEXTO ANTERIOR: ${data.previousDefense?.substring(0, 500)}...` : ""}
      `;

			const result = await model.generateContent([systemInstruction, userPrompt]);
			res.status(200).json({ success: true, data: { defenseText: result.response.text() } });
		} catch (error) {
			if (error.message === "Créditos insuficientes.") {
				res.status(402).json({ error: "Créditos insuficientes. Por favor, recarregue." });
			} else {
				res.status(500).json({ error: error.message });
			}
		}
	});
});

// --- FUNÇÃO 4: CHECKOUT STRIPE ---
exports.createCheckoutSession = onRequest((req, res) => {
	cors(req, res, async () => {
		// RECOMENDADO: Use process.env.STRIPE_SECRET_KEY configurado no Firebase Functions
		// Para teste rápido, substitua abaixo, mas NÃO COMITE em produção real.
		const stripe = require("stripe")(
			process.env.STRIPE_SECRET_KEY
		);

		const { priceId, userId, credits, successUrl, cancelUrl, mode } = req.body;

		if (!userId) {
			res.status(400).json({ error: "Usuário não identificado." });
			return;
		}

		try {
			const session = await stripe.checkout.sessions.create({
				payment_method_types: ["card", "boleto"], // Explícito para evitar erro de versão
				locale: "pt-BR",
				line_items: [
					{
						price: priceId || "price_H5ggYwtDq4fbrJ",
						quantity: 1,
					},
				],
				mode: mode || "payment",
				success_url: successUrl || "http://localhost:5173/profile?success=true",
				cancel_url: cancelUrl || "http://localhost:5173/pricing?canceled=true",
				client_reference_id: userId,
				metadata: {
					userId: userId,
					credits: credits || 1,
				},
			});

			res.status(200).json({ sessionId: session.id, url: session.url });
		} catch (error) {
			console.error("Erro Stripe:", error);
			res.status(500).json({ error: error.message });
		}
	});
});

exports.extractDataFromImage = onRequest((req, res) => {
	cors(req, res, async () => {
		const apiKey = process.env.GEMINI_API_KEY;
		if (!apiKey) return res.status(500).json({ error: "API Key ausente." });

		const { image, mimeType } = req.body || {};

		try {
			const genAI = new GoogleGenerativeAI(apiKey);
			const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

			const systemInstruction = `
        Você é uma IA especializada em OCR de multas de trânsito brasileiras (AIT/Notificação).
        Sua tarefa é extrair os dados da imagem e retornar EXATAMENTE o seguinte JSON preenchido.
        Se um campo não for encontrado ou estiver ilegível, retorne uma string vazia "".
        Não invente dados.
        
        Campos requeridos no JSON:
        {
          "name": "Nome do condutor ou proprietário",
          "plate": "Placa do veículo (ABC-1234)",
          "plateUF": "UF da placa (ex: SP)",
          "vehicleModel": "Marca/Modelo",
          "issuingBody": "Órgão Autuador (ex: DETRAN-SP, PRF)",
          "aitNumber": "Número do Auto de Infração",
          "date": "Data da infração (DD/MM/AAAA)",
          "time": "Hora da infração (HH:MM)",
          "location": "Local da infração",
          "infractionCode": "Código da infração (ex: 7455)",
          "infractionSplit": "Desdobramento (ex: 0)",
          "article": "Artigo do CTB (ex: Art. 218, I)",
          "description": "Descrição da infração",
          "equipmentNumber": "Nº do Equipamento/Radar",
          "lastCalibration": "Data verificação/aferição",
          "defensePhase": "Fase detectada: 'previa' (se Notificação de Autuação), 'jari' (se Notificação de Penalidade/Boleto), 'cetran' (se indeferimento JARI) ou ''"
        }
      `;

			const imagePart = { inlineData: { data: image, mimeType: mimeType } };
			const result = await model.generateContent([systemInstruction, imagePart]);
			const responseText = result.response.text();
			const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

			res.status(200).json({ success: true, data: JSON.parse(cleanedText) });
		} catch (error) {
			console.error("Erro na extração:", error);
			res.status(500).json({ error: "Erro ao ler a imagem." });
		}
	});
});

exports.preAnalyze = onRequest((req, res) => {
	cors(req, res, async () => {
		const apiKey = process.env.GEMINI_API_KEY;
		if (!apiKey) return res.status(500).json({ error: "API Key ausente." });

		const { image, mimeType, ...userData } = req.body || {};
    // NÃO verifica créditos aqui, pois é uma "amostra grátis" para conversão.

		try {
			const genAI = new GoogleGenerativeAI(apiKey);
			const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

			const systemInstruction = `
        Você é um Analista Sênior de Multas de Trânsito. Sua função é avaliar a viabilidade de um recurso e vender a solução para o cliente.
        
        Além da viabilidade, você DEVE verificar se o relato do condutor faz sentido com a infração (Artigo/Código e Descrição).
        Exemplo de contradição grave: Infração por excesso de velocidade em movimento e o condutor diz que o carro estava estacionado na garagem o dia todo.
        Exemplo de coerência: Infração por avanço de sinal e o condutor diz que o sinal estava escondido por uma árvore.

        Saída OBRIGATÓRIA em JSON:
        {
          "viability": "Alta" | "Média" | "Baixa",
          "summary": "Uma frase curta e impactante sobre a chance de anulação.",
          "arguments": ["Argumento técnico 1", "Argumento técnico 2", "Argumento técnico 3", "Argumento técnico 4", "Argumento técnico 5"],
          "divergence": {
             "isDivergent": boolean, // True apenas se houver contradição GRITANTE que inviabilize a defesa técnica proposta.
             "message": "Se houver divergência forte, explique em 1 frase curta alertando o usuário. Caso contrário, string vazia."
          }
        }
      `;

      const userPrompt = `
        Analise esta infração para recurso:
        Infração: ${userData.article || "Não informado"} - ${userData.description || "Análise de imagem"}
        Dados: ${JSON.stringify(userData)}
        
        Identifique erros formais ou teses jurídicas aplicáveis.
        INSTRUÇÃO DE VENDA: Adote uma postura sempre otimista. Tente classificar a viabilidade como "Alta" ou no mínimo "Média" sempre que houver qualquer margem argumentativa, para encorajar o usuário.
        O resumo deve ser motivador e mencionar benefícios além da anulação, como o Efeito Suspensivo (adiamento da penalidade e pontos), a possibilidade de Prescrição Intercorrente ou erros administrativos do órgão.
        Gere 5 argumentos técnicos possíveis.
      `;

      let parts = [systemInstruction, userPrompt];
      if (image) {
         parts.push({ inlineData: { data: image, mimeType: mimeType } });
      }

			const result = await model.generateContent(parts);
      const responseText = result.response.text();
      
      // Limpeza básica para garantir JSON (o modelo as vezes põe markdown ```json ... ```)
      const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      
			res.status(200).json({ success: true, data: JSON.parse(cleanedText) });
		} catch (error) {
      console.error("Erro na pré-análise:", error);
			res.status(500).json({ error: "Erro ao analisar viabilidade." });
		}
	});
});

exports.analyzeDocument = onRequest((req, res) => {
	cors(req, res, async () => {
		const apiKey = process.env.GEMINI_API_KEY;
		if (!apiKey) return res.status(500).json({ error: "API Key ausente." });

		// Recebe Imagem + Dados Complementares do Passo 2
		const { image, mimeType, ...userData } = req.body || {};
		const userId = userData.userId;

		if (!userId) {
			res.status(401).json({ error: "Usuário não autenticado." });
			return;
		}

		try {
			// Verificar e debitar créditos
			await checkAndDeductCredits(userId);

			const genAI = new GoogleGenerativeAI(apiKey);
			const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

			const prompt = `
        Aja como Advogado de Trânsito. Analise a imagem da multa.
        
        DADOS DO CONDUTOR (FORNECIDOS PELO USUÁRIO):
        Nome: ${userData.name || "[NOME]"}, ${userData.nationality}, ${userData.maritalStatus}, ${userData.profession}.
        RG: ${userData.rg} ${userData.rgIssuer}, CPF: ${userData.cpf}.
        CNH: ${userData.cnh} ${userData.cnhCategory}.
        Endereço: ${userData.address}, ${userData.addressNumber} ${userData.addressComplement}, ${userData.neighborhood}, ${userData.city}/${userData.state}, CEP ${userData.zipCode}.

        RELATO DO CONDUTOR (Argumentos de defesa):
        "${userData.description || "Não informado. Analise apenas os erros formais da imagem."}"

        INSTRUÇÕES:
        1. Extraia da imagem: Órgão, AIT, Placa, Marca/Modelo, Data/Hora, Local, Artigo, Equipamento e Fase Processual (se possível identificar).
        2. Mescle os dados extraídos com os dados do condutor acima.
        3. Identifique qual fase da defesa é para que a defesa/recurso seja adequado no endereçamento, direcionamento e argumentação.
        4. Escreva o RECURSO completo. A formatação da versão final não deve ser markdown, e sim formatação estética para leitura humana seguindo as boas práticas estéticas e de formatação de recursos administrativos e jurídicos.
        5. Apresentar apenas o recurso, nada mais, sem cumprimento ao usuário, sem sugestões ao final, apenas o documento do recurso pronto para protocolo.
        6. Não adicionar nada sobre advogado ao final do documento, apenas espaço para assinatura do usuário.
        7. Não levar em consideração absoluta o relato do usuário, mas realmente analisar a fundo e ver quais argumentos são válidos para serem utilizados no recurso.
        8. Seja prolixo na defesa explorando a maior quantidade de pontos possível, mas nunca ultrapassando limites racionais ou legais.
        9. Não insira asteríscos ('*') de formatação desnecessários.
        10. IMPORTANTE: NÃO liste "Dados Extraídos" no início. Comece direto com o endereçamento (ex: "ILUSTRÍSSIMO SENHOR...").
        11. Finalize com: "Nestes termos, pede deferimento. ${userData.signCity || "Local"}, ${userData.signDate || "Data"}."
      `;

            const defenseTypeMap = { 'previa': 'DEFESA PRÉVIA', 'jari': 'RECURSO À JARI', 'cetran': 'RECURSO AO CETRAN' };
            const defenseTypeLabel = defenseTypeMap[userData.defenseType] || 'RECURSO ADMINISTRATIVO';

			const imagePart = { inlineData: { data: image, mimeType: mimeType } };
			const result = await model.generateContent([`TIPO DE PEÇA: ${defenseTypeLabel}\n` + prompt, imagePart]);

			res.status(200).json({ success: true, data: { defenseText: result.response.text() } });
		} catch (error) {
			if (error.message === "Créditos insuficientes.") {
				res.status(402).json({ error: "Créditos insuficientes. Por favor, recarregue." });
			} else {
				res.status(500).json({ error: error.message });
			}
		}
	});
});

exports.stripeWebhook = onRequest(async (req, res) => {
	console.log("🔔 Webhook recebido! Tipo:", req.body.type);

	const stripe = require("stripe")(
		process.env.STRIPE_SECRET_KEY
	);

	const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

	let event;

	if (endpointSecret) {
		const sig = req.headers["stripe-signature"];
		try {
			event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
		} catch (err) {
			console.error(`Webhook Error: ${err.message}`);
			res.status(400).send(`Webhook Error: ${err.message}`);
			return;
		}
	} else {
		event = req.body;
	}

	// Handle the event
	if (event.type === "checkout.session.completed") {
		const session = event.data.object;
		const userId = session.metadata.userId;
		const creditsToAdd = parseInt(session.metadata.credits || "1", 10);

		if (userId) {
			try {
				const userRef = db.collection("users").doc(userId);
				await db.runTransaction(async (t) => {
					const doc = await t.get(userRef);
					const currentCredits = doc.exists ? doc.data().credits || 0 : 0;
          const newCredits = currentCredits + creditsToAdd;

					t.set(userRef, { credits: newCredits }, { merge: true });
          console.log(`Atualizando créditos do usuário ${userId}: ${currentCredits} -> ${newCredits}`);
				});
				console.log(`Adicionados ${creditsToAdd} créditos para o usuário ${userId}`);
			} catch (error) {
				console.error("Erro ao atualizar créditos:", error);
				return res.status(500).send("Erro interno ao atualizar créditos");
			}
		}
	}

	res.send();
});

async function checkAndDeductCredits(userId) {
	const userRef = db.collection("users").doc(userId);

	await db.runTransaction(async (t) => {
		const doc = await t.get(userRef);
		if (!doc.exists) {
			throw new Error("Usuário não encontrado.");
		}

		const data = doc.data();
		const credits = data.credits || 0;
    console.log(`Verificando créditos para ${userId}: possui ${credits}`);

		if (credits <= 0) {
			throw new Error("Créditos insuficientes.");
		}

		t.update(userRef, { credits: credits - 1 });
	});
}
