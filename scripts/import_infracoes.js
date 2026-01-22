const admin = require("firebase-admin");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const collectionName = "infracoes";

async function importCsv() {
	const results = [];
	const csvFilePath = path.join(__dirname, "tabela-infracoes.csv");

	fs.createReadStream(csvFilePath)
		.pipe(
			csv({
				separator: ";", // ALTERADO: Agora configurado para ponto e vírgula
				mapHeaders: ({ header }) => header.trim().replace(/^["\ufeff]+|["\ufeff]+$/g, ""),
			}),
		)
		.on("data", (data) => {
			// Captura o código da infração
			const codigo = data["Código da Infração"];

			if (codigo) {
				results.push({
					codigo: codigo,
					desdobramento: data["Desdob."] || "0",
					descricao: data["Descrição da Infração"],
					artigo: data["Amparo Legal (CTB)"],
					infrator: data["Infrator"],
					gravidade: data["Gravidade"],
					orgao: data["Órgão Competente"],
				});
			}
		})
		.on("end", async () => {
			if (results.length === 0) {
				console.error(
					"❌ Nenhuma linha válida foi processada. Verifique se o arquivo CSV está na mesma pasta do script.",
				);
				return;
			}

			console.log(`🚀 Preparando para salvar ${results.length} infrações...`);

			// Firestore permite lotes (batches) de no máximo 500 operações por vez.
			// Como você tem 258 linhas, um único batch é suficiente.
			const batch = db.batch();

			results.forEach((doc) => {
				// ID único para evitar duplicatas: código-desdobramento
				const docId = `${doc.codigo}-${doc.desdobramento}`;
				const docRef = db.collection(collectionName).doc(docId);
				batch.set(docRef, doc);
			});

			try {
				await batch.commit();
				console.log("✅ Importação concluída com sucesso no Firestore!");
			} catch (error) {
				console.error("❌ Erro ao salvar no Firestore:", error);
			}
		});
}

importCsv();
