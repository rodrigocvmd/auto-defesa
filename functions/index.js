const {onRequest} = require("firebase-functions/v2/https");
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
      credential: admin.credential.cert(serviceAccount)
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
      const docRef = db.collection('infracoes').doc(docId);
      const doc = await docRef.get();
      if (!doc.exists) {
        res.status(404).json({ error: `Infração ${docId} não encontrada.` });
        return;
      }
      res.status(200).json({ success: true, data: { article: doc.data().artigo, description: doc.data().descricao } });
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
        const isRefinement = !!data.refinementInstructions;

		try {
			const genAI = new GoogleGenerativeAI(apiKey);
			const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

			let systemInstruction = `
        Você é um Advogado Especialista em Direito de Trânsito.
        Tarefa: Redigir DEFESA PRÉVIA técnica e persuasiva.
        
        REGRAS:
        1. Estrutura: Endereçamento (CAIXA ALTA), Qualificação, Fatos, Direito, Pedido, Local/Data.
        2. Linguagem: Jurídica culta.
        3. NÃO use Markdown excessivo.
        4. No final, adicione: "Nestes termos, pede deferimento. ${data.signCity || 'Local'}, ${data.signDate || 'Data'}."
      `;

      if (isRefinement) {
        systemInstruction += `\nMODO REFINAMENTO: Reescreva o texto mantendo os dados mas aplicando: "${data.refinementInstructions}".`;
      }

			const userPrompt = `
        CASO: Órgão ${data.issuingBody}, AIT ${data.aitNumber}
        CONDUTOR: ${data.name}, Brasileiro(a), ${data.maritalStatus === 'Outro' ? '' : data.maritalStatus}, ${data.profession}, RG ${data.rg} ${data.rgIssuer}, CPF ${data.cpf}. CNH ${data.cnh} Cat ${data.cnhCategory}.
        ENDEREÇO: ${data.address}, ${data.addressNumber} ${data.addressComplement}, ${data.neighborhood}, ${data.city}/${data.state}, CEP ${data.zipCode}.
        VEÍCULO: ${data.plate}/${data.plateUF}, ${data.vehicleModel}.
        INFRAÇÃO: ${data.article} em ${data.date} às ${data.time}, Local ${data.location}.
        EQUIPAMENTO: ${data.equipmentNumber || 'N/A'}, Aferição ${data.lastCalibration || 'N/A'}.
        
        RELATO: "${data.description}"
        ${isRefinement ? `\nTEXTO ANTERIOR: ${data.previousDefense?.substring(0,500)}...` : ''}
      `;

			const result = await model.generateContent([systemInstruction, userPrompt]);
			res.status(200).json({ success: true, data: { defenseText: result.response.text() } });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	});
});

// --- FUNÇÃO 3: UPLOAD (ATUALIZADA) ---
exports.analyzeDocument = onRequest((req, res) => {
	cors(req, res, async () => {
		const apiKey = process.env.GEMINI_API_KEY;
		if (!apiKey) return res.status(500).json({ error: "API Key ausente." });

		// Recebe Imagem + Dados Complementares do Passo 2
		const { image, mimeType, ...userData } = req.body || {};

		try {
			const genAI = new GoogleGenerativeAI(apiKey);
			const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

			const prompt = `
        Aja como Advogado de Trânsito. Analise a imagem da multa.
        
        DADOS DO CONDUTOR (FORNECIDOS PELO USUÁRIO):
        Nome: ${userData.name || '[NOME]'}, ${userData.nationality}, ${userData.maritalStatus}, ${userData.profession}.
        RG: ${userData.rg} ${userData.rgIssuer}, CPF: ${userData.cpf}.
        CNH: ${userData.cnh} ${userData.cnhCategory}.
        Endereço: ${userData.address}, ${userData.addressNumber} ${userData.addressComplement}, ${userData.neighborhood}, ${userData.city}/${userData.state}, CEP ${userData.zipCode}.

        RELATO DO CONDUTOR (Argumentos de defesa):
        "${userData.description || 'Não informado. Analise apenas os erros formais da imagem.'}"

        INSTRUÇÕES:
        1. Extraia da imagem: Órgão, AIT, Placa, Marca/Modelo, Data/Hora, Local, Artigo, Equipamento.
        2. Mescle os dados extraídos com os dados do condutor acima.
        3. Escreva a DEFESA PRÉVIA completa.
        4. IMPORTANTE: NÃO liste "Dados Extraídos" no início. Comece direto com o "ILUSTRÍSSIMO SENHOR...".
        5. Finalize com: "Nestes termos, pede deferimento. ${userData.signCity || 'Local'}, ${userData.signDate || 'Data'}."
      `;

			const imagePart = { inlineData: { data: image, mimeType: mimeType } };
			const result = await model.generateContent([prompt, imagePart]);
			
			res.status(200).json({ success: true, data: { defenseText: result.response.text() } });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	});
});
