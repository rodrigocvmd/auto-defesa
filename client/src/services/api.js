// Configuração da URL da API
// Em dev (local), usa o emulador. Em produção, usa a variável de ambiente definida no build.
const IS_DEV = import.meta.env.DEV;
const PROJECT_ID = "auto-defesa"; // Corrigido para bater com o emulador
const REGION = "us-central1";

// URL Automática:
// Se houver uma variável VITE_API_URL, usa ela.
// Se não, e estiver em DEV, usa o emulador.
// Fallback final para a URL de produção padrão do Firebase.
const EMULATOR_URL = `http://127.0.0.1:5001/${PROJECT_ID}/${REGION}`;
const PROD_URL = `https://${REGION}-${PROJECT_ID}.cloudfunctions.net`;

const BASE_URL = import.meta.env.VITE_API_URL || (IS_DEV ? EMULATOR_URL : PROD_URL);

export const api = {
  // 1. Defesa Manual
  generateDefense: async (data) => {
    try {
      // Ajuste para chamar a função correta
      const response = await fetch(`${BASE_URL}/generateDefense`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Erro na comunicação com o servidor');
      return await response.json();
    } catch (error) {
      console.error("API Call Error:", error);
      throw error;
    }
  },

  // 2. Defesa via Upload
  analyzeDocument: async (fileBase64, mimeType) => {
    try {
      const response = await fetch(`${BASE_URL}/analyzeDocument`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: fileBase64, mimeType }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.details || 'Erro ao processar documento');
      }
      return await response.json();
    } catch (error) {
      console.error("Upload API Error:", error);
      throw error;
    }
  },

  // 3. Consultar Dados da Infração (Firestore)
  getInfraction: async ({ code, desdobramento }) => {
    try {
      const response = await fetch(`${BASE_URL}/getInfraction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, desdobramento }),
      });

      if (!response.ok) {
        if (response.status === 404) return null; // Não encontrada
        throw new Error('Erro ao buscar infração');
      }
      return await response.json();
    } catch (error) {
      console.error("Firestore API Error:", error);
      throw error;
    }
  }
};