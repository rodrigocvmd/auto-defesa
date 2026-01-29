const { db } = require("./firebase");

async function checkCredits(userId) {
	const userRef = db.collection("users").doc(userId);
	const doc = await userRef.get();
	
	if (!doc.exists) {
		throw new Error("Usuário não encontrado.");
	}
	
	const data = doc.data();
	const credits = data.credits || 0;
	
	if (credits <= 0) {
		throw new Error("Créditos insuficientes.");
	}
	return true;
}

async function deductCredits(userId) {
	const userRef = db.collection("users").doc(userId);

	await db.runTransaction(async (t) => {
		const doc = await t.get(userRef);
		if (!doc.exists) {
			throw new Error("Usuário não encontrado.");
		}

		const data = doc.data();
		const credits = data.credits || 0;

		// Double check inside transaction
		if (credits <= 0) {
			throw new Error("Créditos insuficientes.");
		}

		t.update(userRef, { credits: credits - 1 });
	});
}

module.exports = { checkCredits, deductCredits };
