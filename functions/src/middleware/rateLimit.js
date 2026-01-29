const crypto = require("crypto");
const { admin, db } = require("../services/firebase");

async function checkIpRateLimit(req, limitCount = 3, windowHours = 1) {
	let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

	if (ip && ip.indexOf(",") !== -1) {
		ip = ip.split(",")[0].trim();
	}

	const ipHash = crypto
		.createHash("sha256")
		.update(ip || "unknown")
		.digest("hex");

	const rateRef = db.collection("rate_limits").doc(ipHash);
	const now = admin.firestore.Timestamp.now();

	await db.runTransaction(async (t) => {
		const doc = await t.get(rateRef);
		let data = doc.exists ? doc.data() : { count: 0, resetAt: now };

		if (now.toMillis() > data.resetAt.toMillis()) {
			data = {
				count: 0,
				resetAt: admin.firestore.Timestamp.fromMillis(now.toMillis() + windowHours * 3600 * 1000),
			};
		}

		if (data.count >= limitCount) {
			throw new Error("RATE_LIMIT_EXCEEDED");
		}

		t.set(rateRef, {
			count: data.count + 1,
			resetAt: data.resetAt,
			lastIp: ip, 
		});
	});
}

module.exports = { checkIpRateLimit };
