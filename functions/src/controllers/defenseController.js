const cors = require("../middleware/cors");
const { verifyAuth } = require("../middleware/auth");
const { checkIpRateLimit } = require("../middleware/rateLimit");
const { checkCredits, deductCredits } = require("../services/userService");
const { db } = require("../services/firebase");
const { FieldValue } = require("firebase-admin/firestore");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Produção:
// const MODEL_FLASH = "gemini-3-flash-preview";
// const MODEL_PRO = "gemini-3-pro-preview";
// const MODEL_FALLBACK = "gemini-2.5-flash";

// Testes / Lite:
const MODEL_FLASH = "gemini-2.5-flash-lite";
const MODEL_PRO = "gemini-2.5-flash-lite";
const MODEL_FALLBACK = "gemini-2.5-flash-lite";

/**
 * Tenta gerar conteúdo com o modelo principal. Se der erro 503 (Overloaded),
 * tenta automaticamente com o modelo de fallback (gemini-1.5-flash).
 */
async function generateWithFallback(genAI, primaryModelName, parts) {
	try {
		const model = genAI.getGenerativeModel({ model: primaryModelName });
		return await model.generateContent(parts);
	} catch (error) {
		// Verifica erros comuns de sobrecarga ou indisponibilidade
		if (
			error.message.includes("503") ||
			error.message.includes("overloaded") ||
			error.status === 503
		) {
			console.warn(
				`⚠️ Modelo ${primaryModelName} instável (${error.message}). Tentando fallback para ${MODEL_FALLBACK}...`,
			);
			const fallbackModel = genAI.getGenerativeModel({ model: MODEL_FALLBACK });
			return await fallbackModel.generateContent(parts);
		}
		throw error;
	}
}

exports.generateDefense = (req, res) => {
	cors(req, res, async () => {
		const apiKey = process.env.GEMINI_API_KEY;
		if (!apiKey) {
			res.status(500).json({ error: "API Key ausente." });
			return;
		}

		let userId;
		try {
			userId = await verifyAuth(req);
		} catch (e) {
			res.status(401).json({ error: "Usuário não autenticado." });
			return;
		}

		let data = req.body || {};
		const isRefinement = !!data.refinementInstructions;

		try {
			if (!isRefinement) {
				await checkCredits(userId);
			}

			const genAI = new GoogleGenerativeAI(apiKey);
			const modelName = isRefinement ? MODEL_FLASH : MODEL_PRO;

			// Helper to format date
			const formatDateFull = (dateStr) => {
				if (!dateStr) return "Data";
				try {
					// Tenta criar data. Formatos aceitos: YYYY-MM-DD ou DD/MM/YYYY
					let date;
					if (dateStr.includes("/")) {
						const [day, month, year] = dateStr.split("/");
						date = new Date(`${year}-${month}-${day}T12:00:00`);
					} else {
						date = new Date(dateStr + "T12:00:00");
					}

					if (isNaN(date.getTime())) return dateStr;

					return new Intl.DateTimeFormat("pt-BR", {
						day: "numeric",
						month: "long",
						year: "numeric",
					}).format(date);
				} catch (e) {
					return dateStr;
				}
			};

			const formattedSignDate = formatDateFull(data.signDate);

			const defenseTypeMap = {
				previa: "DEFESA PRÉVIA DE AUTUAÇÃO",
				jari: "RECURSO À JARI (1ª INSTÂNCIA)",
				cetran: "RECURSO AO CETRAN (2ª INSTÂNCIA)",
			};
			const defenseTypeLabel = defenseTypeMap[data.defenseType] || "RECURSO ADMINISTRATIVO";

			let systemInstruction;
			let userPrompt;

			if (isRefinement) {
				systemInstruction = `
          Você é um Editor Jurídico Sênior responsável por revisar e ajustar peças processuais.
          SUA TAREFA: Alterar o documento fornecido seguindo ESTRITAMENTE as instruções do usuário dentro das tags <instrucoes_usuario>.
          
          REGRAS DE OURO:
          1. O documento fornecido em <texto_base> é a única fonte da verdade.
          2. Faça APENAS as alterações solicitadas.
          3. Mantenha a formatação original.
          4. Retorne o documento COMPLETO.
        `;

				userPrompt = `
          <texto_base>
          ${data.previousDefense}
          </texto_base>

          <instrucoes_usuario>
          ${data.refinementInstructions}
          </instrucoes_usuario>

          Ação: Aplique as alterações do usuário no Texto Base e retorne o documento final completo.
        `;
			} else {
				systemInstruction = `
          Você é um Advogado Especialista em Direito de Trânsito.
          Tarefa: Redigir uma defesa de multa de trânsito baseada nos dados fornecidos.
          
          DIRETRIZES:
          1. FORMATO DE SAÍDA: HTML PURO (Não use Markdown, não use blocos de código \`\`\`).
          
          2. REGRAS DE ENDEREÇAMENTO (CRUCIAL):
             - Defesa Prévia: "AO ILUSTRÍSSIMO SENHOR DIRETOR DO [ÓRGÃO AUTUADOR - UF]".
             - JARI (1ª Instância): "AO ILUSTRÍSSIMO SENHOR PRESIDENTE DA JARI DO [ÓRGÃO AUTUADOR - UF]".
             - CETRAN (2ª Instância): 
                 * Regra Geral: "AO ILUSTRÍSSIMO SENHOR PRESIDENTE DO CONSELHO ESTADUAL DE TRÂNSITO DO ESTADO DE [UF] - CETRAN/[UF]".
                 * **EXCEÇÃO DISTRITO FEDERAL:** Se o órgão for do DF (Detran-DF, DER-DF) e for recurso de 2ª instância, endereçar obrigatoriamente ao **CONTRADIFE** (Conselho de Trânsito do Distrito Federal).

          3. REGRAS RÍGIDAS DE ESTILO E FORMATAÇÃO (HTML INLINE):
             *O texto base tem tamanho padrão (aprox 12pt). Títulos devem ter visualmente +2pt (aprox 14pt).*
             
             - **Endereçamento:** Caixa Alta, Negrito, Alinhado à Centralizado/Justificado.
               Use: <p style="font-size: 14pt; font-weight: bold; text-transform: uppercase; text-align: justify; margin-bottom: 40px;">[ENDEREÇAMENTO]</p>
             
             - **Referência do AIT:** Caixa Alta, Fonte Normal (Fina), Centralizado.
               Use: <p style="font-size: 14pt; font-weight: normal; text-transform: uppercase; text-align: center; margin-bottom: 30px;">REF.: AUTO DE INFRAÇÃO Nº ${data.aitNumber || "[NÚMERO]"}</p>
             
             - **Qualificação (COM VEÍCULO/INFRAÇÃO):** Texto corrido normal, iniciando com o nome do recorrente. 
               *INSTRUÇÃO:* Inclua os dados do veículo (Placa ${data.plate}) e da infração (Art. ${data.article}) dentro deste parágrafo de qualificação, de forma fluida no texto.
               Use: <p style="text-align: justify; margin-bottom: 20px;">[NOME], [QUALIFICAÇÃO COMPLETA], proprietário do veículo de placas ${data.plate || "[PLACA]"}, vem apresentar defesa referente à infração do Art. ${data.article}...</p>
             
             - **Título da Defesa:** Caixa Alta, Negrito, Centralizado, Tamanho +2pt.
               Use: <h1 style="font-size: 14pt; font-weight: bold; text-transform: uppercase; text-align: center; margin-top: 30px; margin-bottom: 20px;">${defenseTypeLabel}</h1>
             
             - **Capítulos (I., II.):** Caixa Alta, Negrito, Centralizado, Tamanho +2pt.
               Use: <h2 style="font-size: 14pt; font-weight: bold; text-transform: uppercase; text-align: center; margin-top: 20px; margin-bottom: 10px;">I. DOS FATOS</h2>
             
             - **Subcapítulos (a., b.):** Caixa Alta, Fonte Normal (Fina), Centralizado, Tamanho +2pt.
               Use: <h3 style="font-size: 14pt; font-weight: normal; text-transform: uppercase; text-align: center; margin-top: 15px; margin-bottom: 10px;">A. DA NULIDADE</h3>
             
             - **Corpo do Texto:** Tamanho padrão, Justificado. Use <strong> para ênfase (negrito) em palavras-chave. **NUNCA use sublinhado.**

          4. CONTEÚDO E ESTRATÉGIA:
             - Omissão de Vazios: Não invente dados.
             - Estratégia por Fase:
                - DEFESA PRÉVIA: Foque em ERROS FORMAIS (Art. 280/281 CTB) e aspectos técnicos.
                - RECURSO JARI: Ataque o mérito, cite jurisprudência e rebata indeferimento anterior.
                - RECURSO CETRAN/CONTRADIFE: Rebata a decisão da JARI, alegue falta de fundamentação se genérica.
             - Analise o relato do usuário em <relato_fatos>.
             - EQUIPAMENTO/AFERIÇÃO: Analise 'Equipamento' e 'Aferição'. Se vencida ou ausente em infração que exige medição, use como tese principal.
             - PROLIXIDADE: Desenvolva pelo menos 4 argumentos de mérito.

          5. FINALIZAÇÃO:
             - NUNCA use "por seu procurador".
             - Encerre com o bloco CENTRALIZADO padrão fornecido abaixo.
          9. FINALIZAÇÃO E ASSINATURA: Ao final, obrigatoriamente encerre com o bloco CENTRALIZADO exatamente como abaixo:
             
             <p style="text-align: center; margin-top: 30px;">Nestes termos, pede deferimento.</p>
             <p style="text-align: center; margin-bottom: 90px;">${data.signCity || "Local"}, ${formattedSignDate}.</p>
             
             <p style="text-align: center; margin-top: 90px;">___________________________________________________</p>
             <p style="text-align: center;">${(data.name || "NOME DO RECORRENTE").toUpperCase()}</p>
        `;

				userPrompt = `
          TIPO DE PEÇA: ${defenseTypeLabel}
          
          DIRETRIZ DE GÊNERO/TRATAMENTO: O usuário escolheu ser tratado como '${data.preferredTreatment}'.
             - Se 'O Recorrente': Use concordância masculina (ex: 'O Recorrente', 'o condutor', 'ele').
             - Se 'A Recorrente': Use concordância feminina (ex: 'A Recorrente', 'a condutora', 'ela').
             - Se 'Tratamento neutro': Use termos neutros como 'A Parte Recorrente', 'A Defesa', 'O Requerente'.

          <dados_caso>
          Órgão: ${data.issuingBody || ""}
          AIT: ${data.aitNumber || ""}
          Nome: ${data.name || ""}
          RG: ${data.rg || ""} - ${data.rgIssuer || ""}
          CPF: ${data.cpf || ""}
          CNH: ${data.cnh || "Não informada"}
          Endereço: ${data.address}, ${data.addressNumber} ${data.addressComplement}, ${data.neighborhood}, ${data.city}/${data.state}, CEP ${data.zipCode}
          Placa: ${data.plate || ""}
          Infração: ${data.article || ""}
          Equipamento: ${data.equipmentNumber || ""}
          Aferição: ${data.lastCalibration || ""}
          Cidade de Assinatura: ${data.signCity || ""}
          Data de Assinatura: ${data.signDate || ""}
          </dados_caso>
          
          <relato_fatos>
          ${data.description}
          </relato_fatos>
        `;
			}

			// Chamada com Fallback
			const result = await generateWithFallback(genAI, modelName, [systemInstruction, userPrompt]);
			const defenseText = result.response.text();

			let defenseId = null;

			// Salvar no banco e debitar crédito APÓS geração com sucesso (se não for refinamento)
			if (!isRefinement) {
				// Helper para formatar nome do arquivo: Tipo_Nome_Placa
				const formatFileName = () => {
					const defenseType = (data.defenseType || "").toLowerCase();
					let typeStr = "Defesa_Previa";
					if (defenseType.includes("jari")) typeStr = "Recurso_JARI";
					else if (defenseType.includes("cetran") || defenseType.includes("contradife"))
						typeStr = "Recurso_CETRAN";

					const firstName = (data.name || "Usuario")
						.trim()
						.split(" ")[0]
						.normalize("NFD")
						.replace(/[\u0300-\u036f]/g, "");
					const cleanPlate = (data.plate || "Placa").replace(/[^a-zA-Z0-9]/g, "");

					return `${typeStr}_${firstName}_${cleanPlate}`;
				};

				const defenseData = {
					userId: userId,
					infractionType: data.defenseType || "Análise de Upload",
					licensePlate: data.plate || "",
					defenseText: defenseText,
					status: "completed",
					createdAt: FieldValue.serverTimestamp(),
					fileName: formatFileName(),
				};

				const docRef = await db.collection("defenses").add(defenseData);
				defenseId = docRef.id;

				await deductCredits(userId);
			}

			res.status(200).json({
				success: true,
				data: {
					defenseText: defenseText,
					defenseId: defenseId,
				},
			});
		} catch (error) {
			if (error.message === "Créditos insuficientes.") {
				res.status(402).json({ error: "Créditos insuficientes. Por favor, recarregue." });
			} else {
				console.error("Erro na geração:", error);
				res.status(500).json({ error: error.message || "Erro interno na geração." });
			}
		}
	});
};

exports.extractDataFromImage = (req, res) => {
	cors(req, res, async () => {
		const apiKey = process.env.GEMINI_API_KEY;
		if (!apiKey) return res.status(500).json({ error: "API Key ausente." });

		try {
			await checkIpRateLimit(req, 10, 1);
		} catch (e) {
			if (e.message === "RATE_LIMIT_EXCEEDED") {
				return res
					.status(429)
					.json({ error: "Muitas tentativas. Aguarde um pouco antes de enviar nova imagem." });
			}
		}

		const { image, mimeType } = req.body || {};

		try {
			const genAI = new GoogleGenerativeAI(apiKey);
			// OCR usually works fine with Lite, but fallback is good
			const modelName = MODEL_FLASH;

			const systemInstruction = `
        Você é uma IA especializada em OCR de multas de trânsito e processos administrativos de trânsito brasileiros.
        Sua tarefa é extrair os dados da imagem (que pode ser uma Notificação de Autuação, Penalidade ou uma DECISÃO de recurso) e retornar EXATAMENTE o seguinte JSON preenchido.
        Se um campo não for encontrado ou estiver ilegível, retorne uma string vazia "".
        Não invente dados.
        
        IMPORTANTE SOBRE FASE DA DEFESA ("defensePhase"):
        1. Se for uma "Notificação de Autuação" (sem boleto/código de barras): Retorne "previa".
        2. Se for uma "Notificação de Penalidade" (com boleto/multa): Retorne "jari".
        3. Se for uma DECISÃO ou NOTIFICAÇÃO comunicando o INDEFERIMENTO (negação) da Defesa Prévia: Retorne "jari" (pois o próximo passo é o Recurso à Jari).
        4. Se for uma DECISÃO ou NOTIFICAÇÃO comunicando o INDEFERIMENTO (negação) do Recurso à Jari: Retorne "cetran" (pois o próximo passo é o Recurso ao Cetran).

        Campos requeridos no JSON:
        {
          "name": "Nome do condutor, proprietário ou infrator",
          "plate": "Placa do veículo (ABC-1234)",
          "plateUF": "UF da placa (ex: SP)",
          "vehicleModel": "Marca/Modelo",
          "issuingBody": "Órgão Autuador (ex: DETRAN-SP, PRF, DER)",
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
          "defensePhase": "previa, jari, ou cetran"
        }
      `;

			const imagePart = { inlineData: { data: image, mimeType: mimeType } };

			// Chamada com Fallback
			const result = await generateWithFallback(genAI, modelName, [systemInstruction, imagePart]);

			const responseText = result.response.text();
			const cleanedText = responseText
				.replace(/```json/g, "")
				.replace(/```/g, "")
				.trim();

			res.status(200).json({ success: true, data: JSON.parse(cleanedText) });
		} catch (error) {
			console.error("Erro na extração:", error);
			res.status(500).json({ error: "Erro ao ler a imagem. Tente novamente." });
		}
	});
};

exports.preAnalyze = (req, res) => {
	cors(req, res, async () => {
		const apiKey = process.env.GEMINI_API_KEY;
		if (!apiKey) return res.status(500).json({ error: "API Key ausente." });

		const { image, mimeType, ...userData } = req.body || {};

		let userId = null;
		try {
			userId = await verifyAuth(req);
		} catch (e) {}

		if (!userId) {
			try {
				await checkIpRateLimit(req, 5, 1);
			} catch (e) {
				if (e.message === "RATE_LIMIT_EXCEEDED") {
					return res
						.status(429)
						.json({ error: "Muitas tentativas. Tente novamente em 1 hora ou faça login." });
				}
			}
		}

		try {
			const genAI = new GoogleGenerativeAI(apiKey);
			const modelName = MODEL_FLASH;

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

			// Chamada com Fallback
			const result = await generateWithFallback(genAI, modelName, parts);
			const responseText = result.response.text();

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
};

exports.analyzeDocument = (req, res) => {
	cors(req, res, async () => {
		const apiKey = process.env.GEMINI_API_KEY;
		if (!apiKey) return res.status(500).json({ error: "API Key ausente." });

		let userId;
		try {
			userId = await verifyAuth(req);
		} catch (e) {
			res.status(401).json({ error: "Usuário não autenticado." });
			return;
		}

		const { image, mimeType, ...userData } = req.body || {};

		try {
			await checkCredits(userId);

			const genAI = new GoogleGenerativeAI(apiKey);
			const modelName = MODEL_PRO;

			// Helper to format date
			const formatDateFull = (dateStr) => {
				if (!dateStr) return "Data";
				try {
					// Tenta criar data. Formatos aceitos: YYYY-MM-DD ou DD/MM/YYYY
					let date;
					if (dateStr.includes("/")) {
						const [day, month, year] = dateStr.split("/");
						date = new Date(`${year}-${month}-${day}T12:00:00`);
					} else {
						date = new Date(dateStr + "T12:00:00");
					}

					if (isNaN(date.getTime())) return dateStr;

					return new Intl.DateTimeFormat("pt-BR", {
						day: "numeric",
						month: "long",
						year: "numeric",
					}).format(date);
				} catch (e) {
					return dateStr;
				}
			};

			const formattedSignDate = formatDateFull(userData.signDate);

			const defenseTypeMap = {
				previa: "DEFESA PRÉVIA",
				jari: "RECURSO À JARI",
				cetran: "RECURSO AO CETRAN",
			};
			const defenseTypeLabel = defenseTypeMap[userData.defenseType] || "RECURSO ADMINISTRATIVO";

			const prompt = `
        Aja como Advogado de Trânsito. Analise a imagem da multa.
        
        DIRETRIZ DE GÊNERO/TRATAMENTO: O usuário escolheu ser tratado como '${userData.preferredTreatment}'.
             - Se 'O Recorrente': Use concordância masculina (ex: 'O Recorrente', 'o condutor', 'ele').
             - Se 'A Recorrente': Use concordância feminina (ex: 'A Recorrente', 'a condutora', 'ela').
             - Se 'Tratamento neutro': Use termos neutros como 'A Parte Recorrente', 'A Defesa', 'O Requerente'.

        DADOS DO CONDUTOR (FORNECIDOS PELO USUÁRIO):
        Nome: ${userData.name || "[NOME]"}.
        RG: ${userData.rg} - ${userData.rgIssuer || "UF"}, CPF: ${userData.cpf}.
        CNH: ${userData.cnh || "Não informada"}.
        Endereço: ${userData.address}, ${userData.addressNumber} ${userData.addressComplement}, ${userData.neighborhood}, ${userData.city}/${userData.state}, CEP ${userData.zipCode}.

        RELATO DO CONDUTOR (Argumentos de defesa):
        "${userData.description || "Não informado. Analise apenas os erros formais da imagem."}"

        INSTRUÇÕES DE ELABORAÇÃO:
        1. Extraia da imagem: Órgão, AIT, Placa, Marca/Modelo, Data/Hora, Local, Artigo, Equipamento e Fase Processual.
        2. Mescle com dados do condutor.
        3. Identifique a FASE da defesa para o endereçamento correto.

        4. REGRAS DE ENDEREÇAMENTO (CRUCIAL):
             - Defesa Prévia: "AO ILUSTRÍSSIMO SENHOR DIRETOR DO [ÓRGÃO AUTUADOR - UF]".
             - JARI (1ª Instância): "AO ILUSTRÍSSIMO SENHOR PRESIDENTE DA JARI DO [ÓRGÃO AUTUADOR - UF]".
             - CETRAN (2ª Instância): 
                 * Regra Geral: "AO ILUSTRÍSSIMO SENHOR PRESIDENTE DO CONSELHO ESTADUAL DE TRÂNSITO DO ESTADO DE [UF] - CETRAN/[UF]".
                 * **EXCEÇÃO DISTRITO FEDERAL:** Se o órgão for do DF (Detran-DF, DER-DF) e for recurso de 2ª instância, endereçar obrigatoriamente ao **CONTRADIFE** (Conselho de Trânsito do Distrito Federal).

        5. REGRAS RÍGIDAS DE ESTILO E FORMATAÇÃO (HTML INLINE):
             *O texto base tem tamanho padrão (aprox 12pt). Títulos devem ter visualmente +2pt (aprox 14pt).*
             
             - **Endereçamento:** Caixa Alta, Negrito, Alinhado à Esquerda/Justificado.
               Use: <p style="font-size: 14pt; font-weight: bold; text-transform: uppercase; text-align: justify; margin-bottom: 40px;">[ENDEREÇAMENTO]</p>
             
             - **Referência do AIT:** Caixa Alta, Fonte Normal (Fina), Centralizado.
               Use: <p style="font-size: 14pt; font-weight: normal; text-transform: uppercase; text-align: center; margin-bottom: 30px;">REF.: AUTO DE INFRAÇÃO Nº [NÚMERO]</p>
             
             - **Qualificação (COM VEÍCULO/INFRAÇÃO):** Texto corrido normal, iniciando com o nome do recorrente. 
               *INSTRUÇÃO:* Inclua os dados do veículo (Placa [PLACA]) e da infração (Art. [ARTIGO CTB]) dentro deste parágrafo de qualificação, de forma fluida no texto.
               Use: <p style="text-align: justify; margin-bottom: 20px;">[NOME], [QUALIFICAÇÃO COMPLETA], proprietário do veículo de placas [PLACA], vem apresentar defesa referente à infração do Art. [ARTIGO CTB]...</p>
             
             - **Título da Defesa:** Caixa Alta, Negrito, Centralizado, Tamanho +2pt.
               Use: <h1 style="font-size: 14pt; font-weight: bold; text-transform: uppercase; text-align: center; margin-top: 30px; margin-bottom: 20px;">${defenseTypeLabel}</h1>
             
             - **Capítulos (I., II.):** Caixa Alta, Negrito, Centralizado, Tamanho +2pt.
               Use: <h2 style="font-size: 14pt; font-weight: bold; text-transform: uppercase; text-align: center; margin-top: 20px; margin-bottom: 10px;">I. DOS FATOS</h2>
             
             - **Subcapítulos (a., b.):** Caixa Alta, Fonte Normal (Fina), Centralizado, Tamanho +2pt.
               Use: <h3 style="font-size: 14pt; font-weight: normal; text-transform: uppercase; text-align: center; margin-top: 15px; margin-bottom: 10px;">A. DA NULIDADE</h3>
             
             - **Corpo do Texto:** Tamanho padrão, Justificado. Use <strong> para ênfase (negrito) em palavras-chave. **NUNCA use sublinhado.**

        6. ESTRATÉGIA POR FASE:
           - DEFESA PRÉVIA: Foque obsessivamente em ERROS FORMAIS do AIT.
           - RECURSO JARI: Ataque o mérito, cite jurisprudência e rebata indeferimento anterior.
           - RECURSO CETRAN/CONTRADIFE: Rebata a decisão da JARI, alegue falta de fundamentação.
        
        7. ANÁLISE ESTRATÉGICA DO RELATO: Use o relato do usuário apenas se fortalecer a defesa técnica. Se for confissão ou prejudicial, descarte.
        8. SEJA PROLIXO: Desenvolva no mínimo 4 tópicos completos.
        9. DADOS AUSENTES: Explore a falta de dados no AIT como cerceamento de defesa.
        10. NUNCA utilize a expressão "por seu procurador infra-assinado".
        11. NÃO liste "Dados Extraídos" no início. Comece direto com o endereçamento HTML.
        12. Finalize obrigatoriamente com o bloco de encerramento e assinatura CENTRALIZADO.
        15. Finalize obrigatoriamente com o bloco de encerramento e assinatura CENTRALIZADO, exatamente como abaixo:
            
            <p style="text-align: center; margin-top: 30px;">Nestes termos, pede deferimento.</p>
            <p style="text-align: center; margin-bottom: 90px;">${userData.signCity || "Local"}, ${formattedSignDate}.</p>
            
            <p style="text-align: center; margin-top: 90px;">___________________________________________________</p>
            <p style="text-align: center;">${(userData.name || "NOME DO RECORRENTE").toUpperCase()}</p>
      `;

			const imagePart = { inlineData: { data: image, mimeType: mimeType } };

			// Chamada com Fallback
			const result = await generateWithFallback(genAI, modelName, [
				`TIPO DE PEÇA: ${defenseTypeLabel}\n` + prompt,
				imagePart,
			]);
			const defenseText = result.response.text();

			// Helper para formatar nome do arquivo: Tipo_Nome_Placa
			const formatFileName = () => {
				const defenseType = (userData.defenseType || "").toLowerCase();
				let typeStr = "Defesa_Previa";
				if (defenseType.includes("jari")) typeStr = "Recurso_JARI";
				else if (defenseType.includes("cetran") || defenseType.includes("contradife"))
					typeStr = "Recurso_CETRAN";

				const firstName = (userData.name || "Usuario")
					.trim()
					.split(" ")[0]
					.normalize("NFD")
					.replace(/[\u0300-\u036f]/g, "");
				const cleanPlate = (userData.plate || "Placa").replace(/[^a-zA-Z0-9]/g, "");

				return `${typeStr}_${firstName}_${cleanPlate}`;
			};

			const defenseData = {
				userId: userId,
				infractionType: defenseTypeLabel,
				licensePlate: userData.plate || "",
				defenseText: defenseText,
				status: "completed",
				createdAt: FieldValue.serverTimestamp(),
				fileName: formatFileName(),
			};

			const docRef = await db.collection("defenses").add(defenseData);
			const defenseId = docRef.id;

			await deductCredits(userId);

			res.status(200).json({
				success: true,
				data: {
					defenseText: defenseText,
					defenseId: defenseId,
				},
			});
		} catch (error) {
			if (error.message === "Créditos insuficientes.") {
				res.status(402).json({ error: "Créditos insuficientes. Por favor, recarregue." });
			} else {
				console.error("Erro na análise completa:", error);
				res.status(500).json({ error: error.message || "Erro na geração do recurso." });
			}
		}
	});
};
