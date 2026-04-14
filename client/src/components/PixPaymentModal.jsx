import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

const PixPaymentModal = ({ isOpen, onClose, priceId, guestEmail }) => {
  const [loading, setLoading] = useState(true);
  const [qrCodeBase64, setQrCodeBase64] = useState('');
  const [qrCodeText, setQrCodeText] = useState('');
  const [paymentId, setPaymentId] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      const fetchPixData = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await api.createPixPayment({ priceId, guestEmail });
          setQrCodeBase64(response.qrCodeBase64);
          setQrCodeText(response.qrCode);
          setPaymentId(response.paymentId);
        } catch (err) {
          console.error('Error fetching PIX data:', err);
          setError(err.message || 'Erro ao gerar o pagamento PIX. Tente novamente.');
        } finally {
          setLoading(false);
        }
      };

      fetchPixData();
    } else {
      // Reset state when closed
      setQrCodeBase64('');
      setQrCodeText('');
      setPaymentId(null);
      setError(null);
    }
  }, [isOpen, priceId, guestEmail]);

  useEffect(() => {
    let interval;
    if (isOpen && paymentId) {
      interval = setInterval(async () => {
        try {
          const res = await api.checkPixPaymentStatus(paymentId);
          if (res && res.status === 'paid') {
            clearInterval(interval);
            onClose();
            navigate('/credit-success?success=true');
          }
        } catch (e) {
          // Ignora erros de polling silenciosamente para não interromper a UX
        }
      }, 5000); // Checa a cada 5 segundos
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, paymentId, navigate, onClose]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (qrCodeText) {
      navigator.clipboard.writeText(qrCodeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Pagamento via PIX</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 font-medium">Gerando QR Code...</p>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm">
                {error}
              </div>
              <button 
                onClick={onClose}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Fechar
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="bg-gray-50 p-4 rounded-xl mb-6 shadow-inner border border-gray-100">
                <img 
                  src={`data:image/png;base64,${qrCodeBase64}`} 
                  alt="QR Code PIX" 
                  className="w-64 h-64 object-contain"
                />
              </div>

              <p className="text-sm text-gray-500 mb-4 text-center">
                Aponte a câmera do seu banco para o QR Code acima ou copie o código abaixo.
              </p>

              <div className="w-full space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">PIX Copia e Cola</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 font-mono truncate">
                    {qrCodeText}
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`shrink-0 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      copied 
                        ? 'bg-green-500 text-white' 
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                    }`}
                  >
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="mt-8 w-full border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Fechar e acompanhar pedido
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PixPaymentModal;
