const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function testRead() {
  console.log("Consultando o Firestore...");
  try {
    const snapshot = await db.collection("infracoes").limit(3).get();
    
    if (snapshot.empty) {
      console.log("❌ Nenhuma infração encontrada na coleção 'infracoes'.");
      return;
    }

    console.log(`✅ Sucesso! Encontrados ${snapshot.size} documentos de teste:`);
    snapshot.forEach(doc => {
      console.log(`- ID: ${doc.id} =>`, doc.data().descricao || doc.data()["Descrição da Infração"]);
    });
  } catch (error) {
    console.error("❌ Erro ao ler do Firestore:", error);
  }
}

testRead();