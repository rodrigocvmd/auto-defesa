// Configuração da URL da API
// Em dev (local), usa o emulador. Em produção, usa a variável de ambiente definida no build.
import { auth } from '../firebaseConfig';

const IS_DEV = import.meta.env.DEV;
const USE_EMULATOR = import.meta.env.VITE_USE_EMULATOR === 'true';
const PROJECT_ID = "auto-defesa"; // Corrigido para bater com o emulador
const REGION = "us-central1";

// URL Automática:
// Se houver uma variável VITE_API_URL, usa ela.
// Se não, e VITE_USE_EMULATOR for true, usa o emulador.
// Fallback final para a URL de produção padrão do Firebase.
const EMULATOR_URL = `http://127.0.0.1:5001/${PROJECT_ID}/${REGION}`;
const PROD_URL = `https://${REGION}-${PROJECT_ID}.cloudfunctions.net`;

const BASE_URL = import.meta.env.VITE_API_URL || (USE_EMULATOR ? EMULATOR_URL : PROD_URL);

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

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = 'Erro na comunicação com o servidor';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.details || errorMessage;
    } catch (e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  return await response.json();
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

      return await handleResponse(response);
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

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Erro na pré-análise');
      }
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
// 4. Criar Preferência de Pagamento (Mercado Pago - Checkout Pro)
createPreference: async ({ priceId, userId, credits, guestEmail, successUrl, cancelUrl }) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/createPreference`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
          priceId,
          userId,
          credits,
          guestEmail,
          successUrl: successUrl || window.location.origin + '/credit-success?success=true',
          cancelUrl: cancelUrl || window.location.origin + '/pricing?canceled=true'
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Erro ao iniciar checkout');
    }

    return await response.json();
  } catch (error) {
    console.error("Erro em createPreference:", error);
    throw error;
  }
},

// 4.1 Criar Pagamento via PIX (Mercado Pago)
createPixPayment: async ({ priceId, guestEmail }) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/createPixPayment`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ priceId, guestEmail }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Erro ao iniciar pagamento PIX');
    }

    return await response.json();
  } catch (error) {
    console.error("Erro em createPixPayment:", error);
    throw error;
  }
},

// 5. Consultar Créditos de Convidado
getGuestCredits: async (email) => {
  try {
    const response = await fetch(`${BASE_URL}/getGuestCredits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error('Erro ao consultar créditos.');
    const data = await response.json();
    return data.credits || 0;
  } catch (error) {
    console.error("Erro em getGuestCredits:", error);
    return 0;
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
  },

  // 8. Verificar existência de email no Admin
  checkEmail: async (email) => {
    try {
      const response = await fetch(`${BASE_URL}/checkEmail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error('Erro ao verificar email');
      return await response.json();
    } catch (error) {
      console.error("CheckEmail API Error:", error);
      throw error;
    }
  },

  // 9. Enviar Email de Suporte
  sendSupportEmail: async (data) => {
    try {
      // Não exige auth header obrigatoriamente, mas se quiser proteger pode descomentar
      // const headers = await getAuthHeaders();
      const headers = { 'Content-Type': 'application/json' };
      
      const response = await fetch(`${BASE_URL}/sendSupportEmail`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Erro ao enviar email');
      }
      return await response.json();
    } catch (error) {
      console.error("Support Email Error:", error);
      throw error;
    }
  },

  // 10. Enviar PDF da Defesa por Email
  sendDefensePdfEmail: async (pdfBase64, fileName) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${BASE_URL}/sendDefensePdfEmail`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ pdfBase64, fileName }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Erro ao enviar email com o PDF');
      }
      return await response.json();
    } catch (error) {
      console.error("Send PDF Email Error:", error);
      throw error;
    }
  }
};