const { admin, db } = require("../services/firebase");
const { checkIpRateLimit, checkUserRateLimit } = require("../middleware/rateLimit");

exports.getGuestCredits = async (req, res) => {
	// Configuração Manual de CORS
	res.set("Access-Control-Allow-Origin", "*");
	res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

	if (req.method === "OPTIONS") {
		res.status(204).send("");
		return;
	}

	let body = req.body;
	if (typeof body === "string") {
		try {
			body = JSON.parse(body);
		} catch (e) {
			// Não é JSON, talvez seja o próprio email se enviado como texto puro
		}
	}
	const email = (body?.email || (typeof body === "string" ? body : "")).trim().toLowerCase();
	if (!email) {
		res.status(400).json({ error: "Email obrigatório." });
		return;
	}

	try {
		// Aumentado o limite para evitar bloqueios acidentais por loops no frontend (ex: useEffect)
		await checkIpRateLimit(req, 5000, 1);
	} catch (e) {
		return res.status(429).json({ error: "Muitas consultas. Aguarde uma hora." });
	}

	try {
		let totalCredits = 0;

		// 1. Verificar na coleção de convidados
		const guestRef = db.collection("guest_credits").doc(email);
		const guestDoc = await guestRef.get();
		if (guestDoc.exists) {
			totalCredits += guestDoc.data().credits || 0;
		} else {
			// Fallback 1: Busca pelo campo 'email' (caso o ID não seja o email normalizado)
			const emailQuery = await db.collection("guest_credits").where("email", "==", email).limit(1).get();
			if (!emailQuery.empty) {
				totalCredits += emailQuery.docs[0].data().credits || 0;
			} else {
				// Fallback 2: Busca manual case-insensitive no ID (legado pesado, mas seguro)
				const guestSnapshot = await db.collection("guest_credits").get();
				const legacyDoc = guestSnapshot.docs.find(doc => doc.id.toLowerCase() === email);
				if (legacyDoc) {
					totalCredits += legacyDoc.data().credits || 0;
				}
			}
		}

		// 2. Verificar se existe um usuário cadastrado com esse email
		// Primeiro tentamos via Auth para ter certeza do UID
		try {
			const userRecord = await admin.auth().getUserByEmail(email);
			if (userRecord) {
				const userRef = db.collection("users").doc(userRecord.uid);
				const userDoc = await userRef.get();
				if (userDoc.exists) {
					totalCredits += userDoc.data().credits || 0;
				}
			}
		} catch (authError) {
			// Se não encontrar no Auth, tentamos busca direta no Firestore (caso o Auth falhe por algum motivo)
			const userSnapshot = await db.collection("users").where("email", "==", email).limit(1).get();
			if (!userSnapshot.empty) {
				totalCredits += userSnapshot.docs[0].data().credits || 0;
			}
		}

		res.status(200).json({ credits: totalCredits });
	} catch (error) {
		console.error("Erro ao verificar créditos:", error);
		res.status(500).json({ error: "Erro interno ao verificar créditos." });
	}
};

exports.checkEmail = async (req, res) => {
	// Configuração Manual de CORS (Nuclear Option)
	// Isso garante que os headers sejam enviados independentemente de middleware
	res.set("Access-Control-Allow-Origin", "*");
	res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	res.set("Access-Control-Allow-Headers", "Content-Type");

	// Responder imediatamente à requisição de Preflight (OPTIONS)
	if (req.method === "OPTIONS") {
		res.status(204).send("");
		return;
	}

	const { email } = req.body || {};
	if (!email) {
		res.status(400).json({ error: "Email obrigatório." });
		return;
	}

	try {
		await checkIpRateLimit(req, 30, 1);
	} catch (e) {
		return res.status(429).json({ error: "Muitas tentativas. Aguarde uma hora." });
	}

	try {
		const userRecord = await admin.auth().getUserByEmail(email);
		const providers = userRecord.providerData.map((p) => p.providerId);
		res.status(200).json({ exists: true, providers });
	} catch (error) {
		if (error.code === "auth/user-not-found") {
			res.status(200).json({ exists: false });
		} else {
			console.error("Erro ao verificar email no Admin:", error);
			res.status(500).json({ error: "Erro interno ao verificar email." });
		}
	}
};
