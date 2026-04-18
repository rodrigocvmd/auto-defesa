const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./functions/serviceAccountKey.json'); // Or whatever the admin path is

// Let's just use the existing firebase service from the functions folder
const { db } = require('./functions/src/services/firebase');

async function test() {
    const email = "test@example.com";
    
    // Set a credit
    await db.collection("guest_credits").doc(email).set({
        credits: 5,
        email: email
    });
    
    console.log("Credit set.");
    
    // Now read it back like the controller does
    const guestRef = db.collection("guest_credits").doc(email);
    const guestDoc = await guestRef.get();
    
    if (guestDoc.exists) {
        console.log("Found credits:", guestDoc.data().credits);
    } else {
        console.log("Not found.");
    }
}

test().catch(console.error);
