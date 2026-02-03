const { admin } = require("../services/firebase");

exports.checkEmail = async (req, res) => {
    // Configuração Manual de CORS (Nuclear Option)
    // Isso garante que os headers sejam enviados independentemente de middleware
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    // Responder imediatamente à requisição de Preflight (OPTIONS)
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    const { email } = req.body || {};
    if (!email) {
        res.status(400).json({ error: "Email obrigatório." });
        return;
    }

    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        const providers = userRecord.providerData.map((p) => p.providerId);
        res.status(200).json({ exists: true, providers });
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            res.status(200).json({ exists: false });
        } else {
            console.error("Erro ao verificar email no Admin:", error);
            res.status(500).json({ error: "Erro interno ao verificar email." });
        }
    }
};
