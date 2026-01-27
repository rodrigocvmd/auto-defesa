require('dotenv').config();

async function checkModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ ERRO: Nenhuma GEMINI_API_KEY encontrada no arquivo .env");
    return;
  }

  console.log("📡 Conectando ao Google para listar modelos disponíveis...");

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("\n❌ ERRO NA API DO GOOGLE:");
      console.error(`Código: ${data.error.code}`);
      console.error(`Mensagem: ${data.error.message}`);
      console.error(`Status: ${data.error.status}`);
    } else {
      console.log("\n✅ SUCESSO! Modelos habilitados para sua chave:");
      console.log("------------------------------------------------");
      if (data.models) {
        data.models.forEach(m => {
          if (m.supportedGenerationMethods.includes("generateContent")) {
             console.log(`🔹 ${m.name.replace('models/', '')}`);
          }
        });
      } else {
        console.log("⚠️  Nenhum modelo encontrado. Isso é estranho.");
      }
      console.log("------------------------------------------------");
      console.log("Use um dos nomes acima no seu index.js");
    }
  } catch (error) {
    console.error("\n❌ ERRO DE CONEXÃO:", error.message);
  }
}

checkModels();
