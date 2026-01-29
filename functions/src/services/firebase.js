const admin = require("firebase-admin");

let serviceAccount;
try {
	// Only try to require this if we are in a dev environment or if the file actually exists
    // Ideally, avoid this in production and use default credentials.
	serviceAccount = require("../../service-account.json");
} catch (e) {
    // File not found, likely running in cloud or using default credentials
}

if (admin.apps.length === 0) {
	if (serviceAccount) {
		admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
		});
	} else {
		admin.initializeApp();
	}
}

const db = admin.firestore();

module.exports = { admin, db };
