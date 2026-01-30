const cors = require("../middleware/cors");
const { admin } = require("../services/firebase");

exports.checkEmail = (req, res) => {
	cors(req, res, async () => {
		const { email } = req.body || {};
		if (!email) {
			res.status(400).json({ error: "Email obrigatório." });
			return;
		}

		try {
			await admin.auth().getUserByEmail(email);
			res.status(200).json({ exists: true });
		} catch (error) {
			if (error.code === 'auth/user-not-found') {
				res.status(200).json({ exists: false });
			} else {
				console.error("Erro ao verificar email no Admin:", error);
				res.status(500).json({ error: "Erro interno ao verificar email." });
			}
		}
	});
};
