const { db, admin } = require("./firebase");

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

async function deleteUnverifiedUsers() {
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

    // Note: Firestore doesn't support inequality filters on multiple fields easily without composite indexes.
    // We will query by emailVerified == false and then filter by date in code to avoid index complexity for now,
    // assuming the number of unverified users isn't massive. If it grows, add a compound query.
    const snapshot = await db.collection("users")
        .where("emailVerified", "==", false)
        .get();

    let deletedCount = 0;
    const batch = db.batch();

    for (const doc of snapshot.docs) {
        const userData = doc.data();
        // Check if createdAt exists and is older than cutoff
        // createdAt can be a Firestore Timestamp or a Date string depending on how it was saved.
        // AuthContext saves as "new Date()", which Firestore converts to Timestamp.
        
        let createdAt;
        if (userData.createdAt && userData.createdAt.toDate) {
            createdAt = userData.createdAt.toDate();
        } else if (userData.createdAt) {
            createdAt = new Date(userData.createdAt);
        }

        if (createdAt && createdAt < cutoffDate) {
            try {
                // 1. Delete from Auth
                await admin.auth().deleteUser(doc.id);
                console.log(`Auth user ${doc.id} deleted.`);

                // 2. Queue Firestore deletion
                batch.delete(doc.ref);
                deletedCount++;
            } catch (error) {
                console.error(`Error deleting user ${doc.id}:`, error);
                // If auth user not found (already deleted), we still delete from Firestore
                if (error.code === 'auth/user-not-found') {
                    batch.delete(doc.ref);
                    deletedCount++;
                }
            }
        }
    }

    if (deletedCount > 0) {
        await batch.commit();
    }

    return deletedCount;
}

module.exports = { checkCredits, deductCredits, deleteUnverifiedUsers };
