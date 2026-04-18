const { db, admin } = require("./firebase");

/**
 * Verifica se há créditos disponíveis para o usuário ou convidado.
 * Se for um usuário logado (userId), verifica tanto no documento do usuário 
 * quanto na coleção de guest_credits se houver um userEmail.
 */
async function checkCredits(userId, isGuest = false, userEmail = null) {
	let totalCredits = 0;

	if (isGuest) {
		// userId aqui é o email do convidado
		const normalizedEmail = (userId || "").trim().toLowerCase();
		const guestRef = db.collection("guest_credits").doc(normalizedEmail);
		const doc = await guestRef.get();
		totalCredits = doc.exists ? (doc.data().credits || 0) : 0;
	} else {
		// Usuário registrado
		const userRef = db.collection("users").doc(userId);
		const userDoc = await userRef.get();
		totalCredits += userDoc.exists ? (userDoc.data().credits || 0) : 0;

		// Também verifica se há créditos de convidado vinculados ao mesmo email
		const email = userEmail || (userDoc.exists ? userDoc.data().email : null);
		if (email) {
			const normalizedEmail = email.trim().toLowerCase();
			const guestRef = db.collection("guest_credits").doc(normalizedEmail);
			const guestDoc = await guestRef.get();
			totalCredits += guestDoc.exists ? (guestDoc.data().credits || 0) : 0;
		}
	}
	
	if (totalCredits <= 0) {
		throw new Error("Créditos insuficientes.");
	}
	return totalCredits;
}

/**
 * Deduz um crédito do pool do usuário ou convidado.
 * Se for um usuário logado, tenta deduzir primeiro do documento do usuário,
 * depois da coleção de guest_credits se necessário.
 */
async function deductCredits(userId, isGuest = false, userEmail = null) {
	await db.runTransaction(async (t) => {
		if (isGuest) {
			const normalizedEmail = (userId || "").trim().toLowerCase();
			const guestRef = db.collection("guest_credits").doc(normalizedEmail);
			const doc = await t.get(guestRef);
			const credits = doc.exists ? (doc.data().credits || 0) : 0;

			if (credits <= 0) throw new Error("Créditos insuficientes.");
			t.update(guestRef, { credits: credits - 1 });
		} else {
			const userRef = db.collection("users").doc(userId);
			const userDoc = await t.get(userRef);
			const userCredits = userDoc.exists ? (userDoc.data().credits || 0) : 0;

			const email = userEmail || (userDoc.exists ? userDoc.data().email : null);
			let guestCredits = 0;
			let guestRef = null;

			if (email) {
				const normalizedEmail = email.trim().toLowerCase();
				guestRef = db.collection("guest_credits").doc(normalizedEmail);
				const guestDoc = await t.get(guestRef);
				guestCredits = guestDoc.exists ? (guestDoc.data().credits || 0) : 0;
			}

			if (userCredits + guestCredits <= 0) {
				throw new Error("Créditos insuficientes.");
			}

			// Lógica de dedução: Primeiro do usuário, depois do convidado
			if (userCredits > 0) {
				t.update(userRef, { credits: userCredits - 1 });
			} else if (guestRef) {
				t.update(guestRef, { credits: guestCredits - 1 });
			}
		}
	});
}

async function deleteUnverifiedUsers() {
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

    const snapshot = await db.collection("users")
        .where("emailVerified", "==", false)
        .get();

    let deletedCount = 0;
    const batch = db.batch();

    for (const doc of snapshot.docs) {
        const userData = doc.data();

        if (userData.credits && userData.credits > 0) {
            continue;
        }
        
        let createdAt;
        if (userData.createdAt && userData.createdAt.toDate) {
            createdAt = userData.createdAt.toDate();
        } else if (userData.createdAt) {
            createdAt = new Date(userData.createdAt);
        }

        if (createdAt && createdAt < cutoffDate) {
            try {
                await admin.auth().deleteUser(doc.id);
                console.log(`Auth user ${doc.id} deleted.`);

                batch.delete(doc.ref);
                deletedCount++;
            } catch (error) {
                console.error(`Error deleting user ${doc.id}:`, error);
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
