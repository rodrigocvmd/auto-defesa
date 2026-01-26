// Configuração da URL da API
// Em dev (local), usa o emulador. Em produção, usa a variável de ambiente definida no build.
import { auth } from '../firebaseConfig';

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

// Helper para obter headers com token
const getAuthHeaders = async () => {
  const headers = { 'Content-Type': 'application/json' };
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // 6. Extração de Dados (OCR)
  extractData: async (imageBase64, mimeType) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${BASE_URL}/extractDataFromImage`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ image: imageBase64, mimeType }),
      });

      if (!response.ok) throw new Error('Erro na leitura da imagem');
      return await response.json();
    } catch (error) {
      console.error("Extraction API Error:", error);
      throw error;
    }
  },

  // 5. Pré-análise Gratuita
  preAnalyze: async (data, imageBase64 = null, mimeType = null) => {
    try {
      const body = { ...data };
      if (imageBase64) {
        body.image = imageBase64;
        body.mimeType = mimeType;
      }
      
      const headers = await getAuthHeaders();

      const response = await fetch(`${BASE_URL}/preAnalyze`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Erro na pré-análise');
      return await response.json();
    } catch (error) {
      console.error("Pre-Analyze API Error:", error);
      throw error;
    }
  },

  // 1. Defesa Manual
  generateDefense: async (data) => {
    try {
      const headers = await getAuthHeaders();
      
      // Ajuste para chamar a função correta
      const response = await fetch(`${BASE_URL}/generateDefense`, {
        method: 'POST',
        headers,
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
  analyzeDocument: async (fileBase64, mimeType, userData = {}) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${BASE_URL}/analyzeDocument`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ image: fileBase64, mimeType, ...userData }),
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

  // 4. Criar Sessão de Checkout (Pagamento)
  createCheckoutSession: async ({ priceId, userId, credits, mode, successUrl }) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${BASE_URL}/createCheckoutSession`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
            priceId, 
            userId,
            credits,
            mode, // Envia o modo (payment ou subscription)
            successUrl: successUrl || window.location.origin + '/profile?success=true',
            cancelUrl: window.location.origin + '/pricing?canceled=true'
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Erro ao iniciar pagamento');
      }
      return await response.json();
    } catch (error) {
      console.error("Stripe API Error:", error);
      throw error;
    }
  },

  // 3. Consultar Dados da Infração (Firestore)
  getInfraction: async ({ code, desdobramento }) => {
    try {
      // Leitura pública, sem necessidade de auth header obrigatório, mas mal não faz.
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