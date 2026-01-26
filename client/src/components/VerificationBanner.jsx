import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle, Send } from 'lucide-react';

export default function VerificationBanner() {
    const { currentUser, resendVerificationEmail } = useAuth();
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState(null);

    // Only show if user is logged in but NOT verified
    if (!currentUser || currentUser.emailVerified) {
        return null;
    }

    const handleResend = async () => {
        setSending(true);
        setError(null);
        try {
            await resendVerificationEmail();
            setSent(true);
            setTimeout(() => setSent(false), 5000); // Reset "Sent" message after 5s
        } catch (err) {
            console.error(err);
            setError("Erro ao enviar. Tente novamente mais tarde.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2 text-amber-800">
                    <AlertTriangle size={18} className="shrink-0" />
                    <span>
                        <strong>Atenção:</strong> Seu email ({currentUser.email}) ainda não foi confirmado. 
                        Confirme para liberar todas as funcionalidades.
                    </span>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                    {sent ? (
                        <span className="text-green-600 font-bold flex items-center gap-1">
                            Email enviado! Verifique o Spam.
                        </span>
                    ) : (
                        <>
                            <span className="hidden sm:inline text-amber-600/80 text-xs">
                                Não recebeu? Verifique o Spam ou
                            </span>
                            <button
                                onClick={handleResend}
                                disabled={sending}
                                className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1 disabled:opacity-50"
                            >
                                {sending ? 'Enviando...' : (
                                    <>
                                        Enviar novo email <Send size={12} />
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
            {error && (
                <div className="max-w-7xl mx-auto mt-2 text-xs text-red-600 font-bold">
                    {error}
                </div>
            )}
        </div>
    );
}
