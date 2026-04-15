const crypto = require("crypto");
const { admin, db } = require("../services/firebase");

/**
 * Limita requisições por IP (para usuários anônimos)
 */
async function checkIpRateLimit(req, limitCount = 25, windowHours = 1) {
	// Tenta pegar o IP de forma mais robusta
	let ip = req.headers["x-forwarded-for"] || req.headers["fastly-client-ip"] || req.ip || req.socket.remoteAddress;

	if (ip && typeof ip === 'string' && ip.indexOf(",") !== -1) {
		ip = ip.split(",")[0].trim();
	}

	const ipHash = crypto
		.createHash("sha256")
		.update(ip || "unknown")
		.digest("hex");

	const rateRef = db.collection("rate_limits_ip").doc(ipHash);
	return applyRateLimit(rateRef, limitCount, windowHours, ip);
}

/**
 * Limita requisições por ID de Usuário (para usuários autenticados)
 */
async function checkUserRateLimit(userId, limitCount = 25, windowHours = 1) {
	if (!userId) return;
	const rateRef = db.collection("rate_limits_user").doc(userId);
	return applyRateLimit(rateRef, limitCount, windowHours, userId);
}

/**
 * Lógica genérica de Rate Limit no Firestore
 */
async function applyRateLimit(docRef, limitCount, windowHours, identifier) {
	const now = admin.firestore.Timestamp.now();

	await db.runTransaction(async (t) => {
		const doc = await t.get(docRef);
		let data = doc.exists ? doc.data() : { count: 0, resetAt: now };

		if (now.toMillis() > data.resetAt.toMillis()) {
			data = {
				count: 0,
				resetAt: admin.firestore.Timestamp.fromMillis(now.toMillis() + windowHours * 3600 * 1000),
			};
		}

		if (data.count >= limitCount) {
			console.warn(`[RateLimit] Blocked: ${identifier} (Count: ${data.count}/${limitCount})`);
			throw new Error("RATE_LIMIT_EXCEEDED");
		}

		t.set(docRef, {
			count: data.count + 1,
			resetAt: data.resetAt,
			lastIdentifier: identifier,
		});
	});
}

module.exports = { checkIpRateLimit, checkUserRateLimit };
