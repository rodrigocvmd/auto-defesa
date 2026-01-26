const { onRequest } = require("firebase-functions/v2/https");
require("dotenv").config(); // Carrega variáveis de ambiente locais (para emulador)
const logger = require("firebase-functions/logger");
const crypto = require("crypto"); // Para hash de IP

// --- CONFIGURAÇÃO DE SEGURANÇA (CORS) ---
const allowedOrigins = [
	"http://localhost:5173",
	"https://auto-defesa.web.app",
	"https://auto-defesa.firebaseapp.com",
];

const cors = require("cors")({
	origin: (origin, callback) => {
		// Permitir requisições sem origem (ex: curl, mobile apps) pode ser perigoso para API pública,
		// mas para web apps, o browser sempre manda origin.
		if (!origin) return callback(null, true);
		if (allowedOrigins.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
});

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

// --- HELPER: AUTHENTICATION (Security) ---
async function verifyAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('UNAUTHORIZED');
  }
  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    throw new Error('UNAUTHORIZED');
  }
}

// --- HELPER: RATE LIMIT (Backend) ---
async function checkIpRateLimit(req, limitCount = 3, windowHours = 1) {
	// Tenta pegar o IP real (considerando proxies do Firebase/Google)
	const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
	const ipHash = crypto.createHash("sha256").update(ip || "unknown").digest("hex");
	
	const rateRef = db.collection("rate_limits").doc(ipHash);
	const now = admin.firestore.Timestamp.now();
	
	// Transação para garantir consistência
	await db.runTransaction(async (t) => {
		const doc = await t.get(rateRef);
		let data = doc.exists ? doc.data() : { count: 0, resetAt: now };

		// Se o tempo de janela expirou, reseta
		if (now.toMillis() > data.resetAt.toMillis()) {
			data = { count: 0, resetAt: admin.firestore.Timestamp.fromMillis(now.toMillis() + windowHours * 3600 * 1000) };
		}

		if (data.count >= limitCount) {
			throw new Error("RATE_LIMIT_EXCEEDED");
		}

		t.set(rateRef, { 
			count: data.count + 1, 
			resetAt: data.resetAt,
			lastIp: ip // Apenas para debug/audit se necessário
		});
	});
}

// --- CONFIGURAÇÃO DE MODELOS (HYBRID AI) ---
// Flash: Para tarefas rápidas, OCR, extração e edições simples.
// Pro: Para raciocínio jurídico complexo e redação da pseça inicial.
const MODEL_FLASH = "gemini-2.5-flash-lite";
const MODEL_PRO = "gemini-2.5-flash-lite";

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

    // --- SEGURANÇA: VERIFICAR TOKEN ---
    let userId;
    try {
      userId = await verifyAuth(req);
    } catch (e) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

		let data = req.body || {};
		// O userId vem do token agora, ignoramos o body.userId

		// CLEAN DATA: Remove empty fields to avoid "Field: " in the output
		const cleanData = (obj) => {
			return Object.fromEntries(
				Object.entries(obj).filter(
					([_, v]) => v != null && v !== "" && v !== "null" && v !== "undefined",
				),
			);
		};
		// We clean specific sub-objects or just use cleaned values in the prompt construction
		// However, since we construct the prompt manually below, we will handle empty fields there.

		const isRefinement = !!data.refinementInstructions;

		try {
			if (!isRefinement) {
				await checkAndDeductCredits(userId);
			}

			const genAI = new GoogleGenerativeAI(apiKey);
			const modelName = isRefinement ? MODEL_FLASH : MODEL_PRO;
			const model = genAI.getGenerativeModel({ model: modelName });

			let systemInstruction;
			let userPrompt;

			if (isRefinement) {
				// --- LÓGICA DE REFINAMENTO (EDIÇÃO) ---
				systemInstruction = `
          Você é um Editor Jurídico Sênior responsável por revisar e ajustar peças processuais.
          SUA TAREFA: Alterar o documento fornecido seguindo ESTRITAMENTE as instruções do usuário.
          
          REGRAS DE OURO:
          1. O documento fornecido ("TEXTO BASE") é a fonte da verdade. NÃO gere uma nova defesa do zero baseada em metadados. Use o texto fornecido.
          2. Faça APENAS as alterações solicitadas. Se o usuário pedir para mudar o argumento X, mantenha o resto do texto (Endereçamento, Qualificação, Fatos, Pedidos) INALTERADO.
          3. Mantenha a formatação e o estilo do texto original.
          4. Se a instrução for vaga (ex: "Melhore o texto"), apenas corrija gramática e fluidez, sem alterar a tese jurídica base.
          5. Retorne o documento COMPLETO, pronto para uso/impressão.
        `;

				userPrompt = `
          TEXTO BASE (DEFESA EXISTENTE):
          """
          ${data.previousDefense}
          """

          INSTRUÇÕES DE ALTERAÇÃO DO USUÁRIO:
          "${data.refinementInstructions}"

          Ação: Aplique as alterações no Texto Base e retorne o documento final completo.
        `;
			} else {
				// --- LÓGICA DE GERAÇÃO INICIAL ---
				systemInstruction = `
          Você é um Advogado Especialista em Direito de Trânsito com 20 anos de experiência em Recursos Administrativos.
          Tarefa: Redigir uma defesa/recurso de multa de trânsito.
          
          DIRETRIZES DE ESTÉTICA E FORMATAÇÃO (IMPORTANTE):
          1. **Visual Profissional:** Não use Markdown (negrito com **, itálico com _). Use formatação visual limpa que simule um documento Word/PDF.
          2. **Títulos:** Use CAIXA ALTA para o Endereçamento e Títulos das Seções (DOS FATOS, DO DIREITO, DOS PEDIDOS).
          3. **Espaçamento:** Deixe espaços claros entre os parágrafos para facilitar a leitura do julgador.
          4. **Estilo:** Formal, respeitoso, técnico, mas direto. Evite juridiquês arcaico desnecessário ("data venia" excessivo), foque na clareza dos fatos e da lei.
          
          REGRAS DE CONTEÚDO:
          1. Identifique qual fase da defesa é (Defesa Prévia, JARI ou CETRAN) com base no contexto.
          2. **Omissão de Vazios:** Se uma informação não foi fornecida no prompt (ex: Categoria da CNH, marca do veículo), NÃO a invente e NÃO a mencione no texto. Não escreva "CNH: [Vazio]" ou "Categoria: ". Simplesmente omita o campo.
          3. A qualificação deve fluir no texto. Ex: "FULANO DE TAL, brasileiro, solteiro, portador do RG nº X e CPF nº Y..." em vez de lista de tópicos.
          4. Apresentar apenas o recurso, nada mais. Sem "Aqui está seu recurso" no início.
          5. Não adicionar espaço para assinatura de advogado, apenas "Assinatura do Requerente/Condutor".
          6. ANÁLISE DO RELATO DO USUÁRIO:
             a) Verifique a congruência temática. Se o relato for sobre outro assunto, ignore-o.
             b) Se for sobre o mesmo assunto, filtre o conteúdo: Utilize APENAS partes que ajudem na defesa.
             c) Se o relato for fraco, prejudicial ("confissão de culpa") ou inútil, DESCONSIDERE-O total ou parcialmente e foque exclusivamente em teses técnicas e formais (ex: erro de notificação, aferição, sinalização).
             d) Priorize sempre a melhor tese jurídica técnica sobre o relato leigo do usuário.
          7. Seja prolixo e exaustivo na argumentação jurídica.
          8. No final, adicione: "Nestes termos, pede deferimento. ${data.signCity || "Local"}, ${data.signDate || "Data"}."
        `;

				const defenseTypeMap = {
					previa: "DEFESA PRÉVIA DE AUTUAÇÃO",
					jari: "RECURSO À JARI (1ª INSTÂNCIA)",
					cetran: "RECURSO AO CETRAN (2ª INSTÂNCIA)",
				};
				const defenseTypeLabel = defenseTypeMap[data.defenseType] || "RECURSO ADMINISTRATIVO";

				// Helper to format fields only if present
				const fmt = (label, value, suffix = "") => (value ? `${label} ${value}${suffix}, ` : "");
				const fmtDirect = (value, suffix = "") => (value ? `${value}${suffix}, ` : "");

				// Constructing the prompt carefully to avoid empty labels
				userPrompt = `
          TIPO DE PEÇA: ${defenseTypeLabel}
          
          DADOS DO CASO (Use apenas o que estiver preenchido):
          Órgão: ${data.issuingBody || ""}
          AIT: ${data.aitNumber || ""}
          
          QUALIFICAÇÃO (Monte um parágrafo fluido com estes dados):
          Nome: ${data.name || ""}
          Nacionalidade: ${data.nationality || "Brasileiro(a)"}
          Estado Civil: ${data.maritalStatus === "Outro" ? "" : data.maritalStatus || ""}
          Profissão: ${data.profession || ""}
          RG: ${data.rg || ""} ${data.rgIssuer || ""}
          CPF: ${data.cpf || ""}
          CNH: ${data.cnh || ""} ${data.cnhCategory ? `(Categoria ${data.cnhCategory})` : ""}
          Endereço: ${data.address || ""}, ${data.addressNumber || ""} ${data.addressComplement || ""}
          Bairro: ${data.neighborhood || ""}
          Cidade/UF: ${data.city || ""}/${data.state || ""}
          CEP: ${data.zipCode || ""}
          Telefone/Email: (Apenas para cadastro, não precisa estar no corpo da qualificação pública se não quiser)
          
          DADOS DO VEÍCULO E INFRAÇÃO:
          Placa: ${data.plate || ""} ${data.plateUF || ""}
          Modelo: ${data.vehicleModel || ""}
          Infração: ${data.article || ""}
          Data/Hora: ${data.date || ""} às ${data.time || ""}
          Local: ${data.location || ""}
          Equipamento: ${data.equipmentNumber || ""}
          Aferição: ${data.lastCalibration || ""}
          
          RELATO DOS FATOS (Argumentos do Usuário):
          "${data.description}"
        `;
			}

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
		const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

    // --- SEGURANÇA: VERIFICAR TOKEN ---
    let userId;
    try {
      userId = await verifyAuth(req);
    } catch (e) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

		const { priceId, successUrl, cancelUrl, mode } = req.body;
    // Ignoramos req.body.userId por segurança e usamos o userId do token

		// MAPA DE PREÇOS X CRÉDITOS (SEGURANÇA)
		// Substitua os IDs abaixo pelos 'API ID' que aparecem no seu Dashboard do Stripe (Produtos > Preços)
		const PRICE_CREDITS_MAP = {
			price_1SsUk8Qphe4gmDmiJhdjZsL4: 1, // Ex: Recurso Único (R$ 29,90)
			price_1SsUkvQphe4gmDmiExt4PDuw: 5, // Ex: Combo 5 Recursos (R$ 99,00)
			price_1SsUlDQphe4gmDmimwZpXhQg: 10, // Ex: Combo Profissional 10 Recursos (R$ 149,00)
		};

		const selectedPriceId = priceId || "price_H5ggYwtDq4fbrJ";
		const creditsAmount = PRICE_CREDITS_MAP[selectedPriceId];

		if (!creditsAmount) {
			console.error(`❌ Tentativa de compra com preço inválido: ${selectedPriceId}`);
			res.status(400).json({ error: "Produto inválido." });
			return;
		}

		try {
			const session = await stripe.checkout.sessions.create({
				payment_method_types: ["card", "boleto"], // Explícito para evitar erro de versão
				locale: "pt-BR",
				line_items: [
					{
						price: selectedPriceId,
						quantity: 1,
					},
				],
				mode: mode || "payment",
				success_url: successUrl || "http://localhost:5173/profile?success=true",
				cancel_url: cancelUrl || "http://localhost:5173/pricing?canceled=true",
				client_reference_id: userId,
				metadata: {
					userId: userId,
					credits: creditsAmount, // Fonte segura (servidor)
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
    
    // Ferramenta pública, pode ser usada sem autenticação ou com autenticação opcional
    // Se quisermos restringir, basta descomentar abaixo:
    // try { await verifyAuth(req); } catch (e) { return res.status(401).json({error: "Login necessário"}); }

		const { image, mimeType } = req.body || {};

		try {
			const genAI = new GoogleGenerativeAI(apiKey);
			const model = genAI.getGenerativeModel({ model: MODEL_FLASH });

			const systemInstruction = `
        Você é uma IA especializada em OCR de multas de trânsito brasileiras (AIT/Notificação).
        Sua tarefa é extrair os dados da imagem e retornar EXATAMENTE o seguinte JSON preenchido.
        Se um campo não for encontrado ou estiver ilegível, retorne uma string vazia "".
        Não invente dados.
        
        Campos requeridos no JSON:
        {
          "name": "Nome do condutor, proprietário ou infrator (Busque por 'Nome', 'Proprietário', 'Condutor' ou próximo ao CPF)",
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
			const cleanedText = responseText
				.replace(/```json/g, "")
				.replace(/```/g, "")
				.trim();

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
		
    // Tenta verificar se está autenticado. Se sim, bypass rate limit (ou aumente).
    // Se não, aplica rate limit por IP.
    let userId = null;
    try {
      userId = await verifyAuth(req);
    } catch(e) {
      // Não autenticado
    }

    if (!userId) {
      try {
        // RATE LIMIT BACKEND: 5 tentativas por hora por IP para pré-análise
        // Isso protege sua cota da OpenAI/Gemini contra scripts de loop
        await checkIpRateLimit(req, 5, 1);
      } catch (e) {
        if (e.message === "RATE_LIMIT_EXCEEDED") {
          return res.status(429).json({ error: "Muitas tentativas. Tente novamente em 1 hora ou faça login." });
        }
        console.error("Erro Rate Limit:", e);
      }
    }

		try {
			const genAI = new GoogleGenerativeAI(apiKey);
			const model = genAI.getGenerativeModel({ model: MODEL_FLASH });

			const systemInstruction = `
			        Você é um Analista Sênior de Multas de Trânsito. Sua função é avaliar a viabilidade de um recurso e vender a solução para o cliente.
			        
			        Além da viabilidade, você DEVE verificar a congruência MATERIAL entre o relato do condutor e a infração.
			        CRITÉRIO DE INCONGRUÊNCIA: Apenas alerte divergência se o relato tratar de um tema TOTALMENTE ALHEIO à infração (Ex: Infração de velocidade e relato sobre cinto de segurança; Infração de sinal vermelho e relato sobre documentação).
			        CRITÉRIO DE ACEITAÇÃO: Se o relato tratar do mesmo objeto/materialidade da infração, mesmo que o argumento seja fraco, ruim, dispensável ou juridicamente inválido, NÃO considere como divergência. O foco é apenas a pertinência temática.
			
			        Saída OBRIGATÓRIA em JSON:
			        {
			          "viability": "Muito Alta" | "Alta" | "Possível",
			          "summary": "Uma frase curta e impactante sobre a chance de anulação.",
			          "arguments": ["Argumento técnico 1", "Argumento técnico 2", "Argumento técnico 3", "Argumento técnico 4", "Argumento técnico 5"],
			          "divergence": {
			             "isDivergent": boolean,
			             "message": "Se houver divergência forte, explique em 1 frase curta alertando o usuário. Caso contrário, string vazia."
			          }
			        }
			      `;

			const userPrompt = `
			        Analise esta infração para recurso:
			        Infração: ${userData.article || "Não informado"} - ${userData.description || "Análise de imagem"}
			        Dados: ${JSON.stringify(userData)}
			        
			        Identifique erros formais ou teses jurídicas aplicáveis.
			        INSTRUÇÃO DE VENDA E ESCALA:
			        1. A escala de viabilidade para casos reais deve ser EXCLUSIVAMENTE: "Possível", "Alta" ou "Muito Alta". NUNCA retorne "Baixa" ou "Média".
			        2. "Possível": Para casos com argumentos genéricos ou testemunhais.
			        3. "Alta": Para casos com bons argumentos técnicos ou erros formais visíveis.
			        4. "Muito Alta": Para casos de erro crasso ou nulidade evidente.
			        
			        ESTRATÉGIA: Seja sempre otimista mas realista. Se os argumentos técnicos forem escassos ou fracos, classifique como "Possível" e FORCE a venda focando nos benefícios secundários: Efeito Suspensivo (adiar pontos e pagamento), chance de Prescrição Intercorrente (se o processo demorar) e a possibilidade de o órgão cometer erros administrativos durante o julgamento (nulidade superveniente).
			        O resumo deve ser motivador.
			        Gere 5 argumentos técnicos possíveis (ou teses acessórias como o Efeito Suspensivo se não houver teses diretas fortes).
			      `;
			let parts = [systemInstruction, userPrompt];
			if (image) {
				parts.push({ inlineData: { data: image, mimeType: mimeType } });
			}

			const result = await model.generateContent(parts);
			const responseText = result.response.text();

			// Limpeza básica para garantir JSON (o modelo as vezes põe markdown ```json ... ```)
			const cleanedText = responseText
				.replace(/```json/g, "")
				.replace(/```/g, "")
				.trim();

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

    // --- SEGURANÇA: VERIFICAR TOKEN ---
    let userId;
    try {
      userId = await verifyAuth(req);
    } catch (e) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

		// Recebe Imagem + Dados Complementares do Passo 2
		const { image, mimeType, ...userData } = req.body || {};
    // ignoramos req.body.userId

		try {
			// Verificar e debitar créditos
			await checkAndDeductCredits(userId);

			const genAI = new GoogleGenerativeAI(apiKey);
			// Análise completa gera o recurso final -> Usa PRO
			const model = genAI.getGenerativeModel({ model: MODEL_PRO });

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
        7. ANÁLISE ESTRATÉGICA DO RELATO: Verifique se o relato do usuário é congruente e benéfico. Se o relato contiver argumentos fracos, prejudiciais (ex: confissão) ou inúteis, DESCONSIDERE essas partes e construa a defesa baseada em argumentos técnicos e erros formais. Utilize do relato apenas o que fortalecer a defesa.
        8. Seja prolixo na defesa explorando a maior quantidade de pontos possível, mas nunca ultrapassando limites racionais ou legais.
        9. Não insira asteríscos ('*') de formatação desnecessários.
        10. IMPORTANTE: NÃO liste "Dados Extraídos" no início. Comece direto com o endereçamento (ex: "ILUSTRÍSSIMO SENHOR...").
        11. Finalize com: "Nestes termos, pede deferimento. ${userData.signCity || "Local"}, ${userData.signDate || "Data"}."
      `;

			const defenseTypeMap = {
				previa: "DEFESA PRÉVIA",
				jari: "RECURSO À JARI",
				cetran: "RECURSO AO CETRAN",
			};
			const defenseTypeLabel = defenseTypeMap[userData.defenseType] || "RECURSO ADMINISTRATIVO";

			const imagePart = { inlineData: { data: image, mimeType: mimeType } };
			const result = await model.generateContent([
				`TIPO DE PEÇA: ${defenseTypeLabel}\n` + prompt,
				imagePart,
			]);

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
	console.log("🔔 Webhook recebido! Headers:", JSON.stringify(req.headers));
	console.log("🔔 Webhook recebido! Body Type:", typeof req.body);
	console.log("🔔 Webhook recebido! Event Type (from body):", req.body?.type);

	const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
	const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

	console.log(
		`🔑 Webhook Secret configurado: ${endpointSecret ? "SIM (Inicia com " + endpointSecret.substring(0, 5) + ")" : "NÃO"}`,
	);

	if (!endpointSecret) {
		console.warn(
			"⚠️ AVISO: STRIPE_WEBHOOK_SECRET não está definido. A verificação de assinatura será pulada (INSEGURO EM PRODUÇÃO).",
		);
	}

	let event;

	if (!endpointSecret) {
		console.error("❌ ERRO CRÍTICO: STRIPE_WEBHOOK_SECRET não está definido.");
		res.status(500).send("Configuration Error: Webhook Secret missing.");
		return;
	}

	const sig = req.headers["stripe-signature"];

	if (!req.rawBody) {
		console.error(
			"❌ ERRO CRÍTICO: req.rawBody está undefined. O middleware do Firebase pode ter parseado o corpo antes. Verifique a configuração.",
		);
		res.status(400).send("Webhook Error: req.rawBody is missing.");
		return;
	}

	try {
		event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
		console.log("✅ Assinatura do Webhook verificada com sucesso.");
	} catch (err) {
		console.error(`❌ Webhook Signature Error: ${err.message}`);
		console.error(
			`Dica: Verifique se o segredo 'whsec_...' gerado pelo 'stripe listen' é o mesmo que está no seu .env.`, 
		);
		res.status(400).send(`Webhook Error: ${err.message}`);
		return;
	}

	// Handle the event
	if (event.type === "checkout.session.completed") {
		const session = event.data.object;
		const userId = session.metadata.userId;
		const creditsToAdd = parseInt(session.metadata.credits || "1", 10);

		console.log(
			`📦 Processando checkout para UserId: ${userId}, Créditos a adicionar: ${creditsToAdd}`,
		);

		if (userId) {
			try {
				const userRef = db.collection("users").doc(userId);
				await db.runTransaction(async (t) => {
					const doc = await t.get(userRef);
					const currentCredits = doc.exists ? doc.data().credits || 0 : 0;
					const newCredits = currentCredits + creditsToAdd;

					t.set(userRef, { credits: newCredits }, { merge: true });
					console.log(
						`✅ SUCESSO: Atualizando créditos do usuário ${userId}: ${currentCredits} -> ${newCredits}`,
					);
				});
				console.log(
					`🎉 Transação concluída. Adicionados ${creditsToAdd} créditos para o usuário ${userId}`,
				);
			} catch (error) {
				console.error("❌ ERRO ao atualizar créditos no Firestore:", error);
				return res.status(500).send("Erro interno ao atualizar créditos");
			}
		} else {
			console.error("❌ ERRO: UserId não encontrado nos metadados da sessão Stripe.");
		}
	} else {
		console.log(`ℹ️ Evento ignorado: ${event.type}`);
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