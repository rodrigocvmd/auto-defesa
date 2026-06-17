import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle, Send, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function VerificationBanner() {
    const { currentUser, resendVerificationEmail } = useAuth();
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState(null);
    const [isClosed, setIsClosed] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Only load the closed state from session storage once on mount
        const closedStatus = sessionStorage.getItem('verificationBannerClosed');
        if (closedStatus === 'true') {
            setIsClosed(true);
        }
    }, []);

    // Only show if user is logged in but NOT verified
    if (!currentUser || currentUser.emailVerified) {
        return null;
    }

    const isProfilePage = location.pathname === '/profile';

    // If it's closed and we are NOT on the profile page, don't render it
    if (isClosed && !isProfilePage) {
        return null;
    }

    const handleClose = () => {
        setIsClosed(true);
        sessionStorage.setItem('verificationBannerClosed', 'true');
    };

    const handleResend = async () => {
        setSending(true);
        setError(null);
        try {
            await resendVerificationEmail();
            setSent(true);
            setTimeout(() => setSent(false), 5000); // Reset "Sent" message after 5s
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/too-many-requests') {
                setError("Muitas tentativas recentes. Aguarde alguns instantes.");
            } else {
                setError("Erro ao enviar: " + (err.message || "Tente novamente."));
            }
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 relative">
            {!isProfilePage && (
                <button 
                    onClick={handleClose} 
                    className="absolute right-2 top-2 text-amber-700 hover:text-amber-900 transition-colors p-1"
                    aria-label="Fechar aviso"
                >
                    <X size={16} />
                </button>
            )}
            
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-3 text-sm pr-6">
                <div className="flex items-center gap-2 text-amber-800 text-center lg:text-left">
                    <AlertTriangle size={18} className="shrink-0 hidden lg:block" />
                    <span>
                        <strong className="lg:hidden">Email não confirmado.</strong>
                        <span className="hidden lg:inline">Seu email ainda não foi confirmado. </span> 
                        Confirme-o para garantir o recebimento em PDF dos seus recursos.
                    </span>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                    {sent ? (
                        <span className="text-green-600 font-bold flex items-center gap-1 text-xs sm:text-sm">
                            Email enviado! Verifique o Spam.
                        </span>
                    ) : (
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                            <span className="text-amber-800 text-sm sm:text-md text-center">
                                Não recebeu o email? Verifique o SPAM ou
                            </span>
                            <button
                                onClick={handleResend}
                                disabled={sending}
                                className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1 disabled:opacity-50 text-sm sm:text-md w-full sm:w-auto justify-center"
                            >
                                {sending ? 'Enviando...' : (
                                    <>
                                        Envie nova confirmação <Send size={16} />
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {error && (
                <div className="max-w-7xl mx-auto mt-2 text-xs text-red-600 font-bold text-center sm:text-left">
                    {error}
                </div>
            )}
        </div>
    );
}
