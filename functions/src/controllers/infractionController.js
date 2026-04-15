const cors = require("../middleware/cors");
const { db } = require("../services/firebase");
const { checkIpRateLimit } = require("../middleware/rateLimit");

exports.getInfraction = (req, res) => {
	cors(req, res, async () => {
		try {
            // FIX: Added rate limit for public query
            await checkIpRateLimit(req, 54, 1); 
        } catch (e) {
             if (e.message === "RATE_LIMIT_EXCEEDED") {
				return res
					.status(429)
					.json({ error: "Muitas tentativas. Aguarde um pouco." });
			}
        }

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
};
