const { admin } = require("../services/firebase");

async function verifyAuth(req) {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		throw new Error("UNAUTHORIZED");
	}
	const token = authHeader.split("Bearer ")[1];
	try {
		const decodedToken = await admin.auth().verifyIdToken(token);
		return decodedToken.uid;
	} catch (error) {
		throw new Error("UNAUTHORIZED");
	}
}

module.exports = { verifyAuth };
