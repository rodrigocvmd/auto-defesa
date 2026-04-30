import React, { useState } from 'react';
import { Download, Mail, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';

export const DownloadSuccessModal = ({ onClose, btnText, onBtnClick, handleSendEmail, emailSuccess }) => {
    const navigate = useNavigate();
    const { currentUser, resendVerificationEmail } = useAuth();
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(emailSuccess || false);
    const [resendingVerification, setResendingVerification] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);

    const isEmailVerified = currentUser?.emailVerified;

    const handleClick = () => {
        if (onBtnClick) {
            onBtnClick();
        } else {
            onClose();
            navigate(currentUser ? "/profile" : "/register");
        }
    };

    const onSendMailClick = async () => {
        if (handleSendEmail && isEmailVerified) {
            setSending(true);
            const success = await handleSendEmail();
            if (success) {
                setSent(true);
            }
            setSending(false);
        }
    };

    const handleResendVerification = async () => {
        setResendingVerification(true);
        try {
            await resendVerificationEmail();
            setVerificationSent(true);
        } catch (error) {
            console.error("Erro ao reenviar email de verificação:", error);
            alert("Erro ao reenviar email. Tente novamente mais tarde.");
        } finally {
            setResendingVerification(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div id='successDownloadModal' className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative p-8">
                <div className="text-center mb-6">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                        <Download size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Download Iniciado!</h2>
                </div>
                <p className="text-gray-600 text-center mb-8 leading-relaxed">
                    O arquivo PDF está sendo gerado.
                    <br/><br/>
                    Uma cópia do arquivo também foi salva em <strong>"Minhas Defesas"</strong> no seu perfil, para que você possa baixar novamente quando precisar.
                </p>

                {sent ? (
                    <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6 flex items-center gap-3">
                        <CheckCircle2 className="flex-shrink-0" />
                        <span className="text-sm font-medium">PDF enviado com sucesso para o seu email de cadastro!</span>
                    </div>
                ) : (
                    handleSendEmail && (
                        isEmailVerified ? (
                            <button
                                onClick={onSendMailClick}
                                disabled={sending}
                                className="w-full mb-3 flex items-center justify-center gap-2 bg-white border-2 border-blue-600 text-blue-600 font-bold py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-sm disabled:opacity-50">
                                <Mail size={20} />
                                {sending ? "Enviando..." : "Enviar cópia por Email"}
                            </button>
                        ) : (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="text-yellow-600 mt-1 flex-shrink-0" size={20} />
                                    <div className="text-sm text-yellow-800">
                                        <p className="font-semibold mb-1">Email não verificado</p>
                                        <p className="mb-3">Caso queira enviar o recurso por email, realize a verificação do email informado.</p>
                                        {verificationSent ? (
                                            <p className="text-green-600 font-semibold flex items-center gap-1">
                                                <CheckCircle2 size={16} />
                                                Email de verificação enviado!
                                            </p>
                                        ) : (
                                            <button 
                                                onClick={handleResendVerification}
                                                disabled={resendingVerification}
                                                className="flex items-center gap-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium py-2 px-3 rounded-lg transition-colors text-xs disabled:opacity-50">
                                                <Send size={14} />
                                                {resendingVerification ? "Enviando..." : "Enviar novo email de verificação"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    )
                )}

                <button
                    onClick={handleClick}
                    className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg">
                    {btnText || "Ir para Minhas Defesas"}
                </button>
            </div>
        </div>
    );
};
