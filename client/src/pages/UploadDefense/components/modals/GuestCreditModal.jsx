import React, { useState } from 'react';
import { Mail, Zap, User, Search, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from "../../../../services/api";

export const GuestCreditModal = ({ onClose, formData, analysisData }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isRecovering, setIsRecovering] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const handleProceed = () => {
        const normalizedEmail = (email || "").trim().toLowerCase();
        if (!normalizedEmail || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
            setEmailError('Por favor, insira um email válido.');
            return;
        }

        setEmailError('');
        localStorage.setItem(
            "pendingDefenseData",
            JSON.stringify({
                formData,
                analysisData,
                source: "upload",
            })
        );
        localStorage.setItem("guestEmail", normalizedEmail);
        window.dispatchEvent(new Event("guestEmailChanged"));
        navigate("/pricing?redirect=/upload/analysis");
    };

    const handleRecover = async () => {
        const normalizedEmail = (email || "").trim().toLowerCase();
        if (!normalizedEmail || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
            setEmailError('Por favor, insira um email válido para recuperar seus créditos.');
            return;
        }

        setEmailError('');
        setIsVerifying(true);

        try {
            const data = await api.getGuestCredits(normalizedEmail);
            if (data.credits > 0) {
                localStorage.setItem("guestEmail", normalizedEmail);
                window.dispatchEvent(new Event("guestEmailChanged"));
                // Redirects back or closes modal to trigger analysis state update
                window.location.reload(); 
            } else {
                setEmailError("Nenhum crédito encontrado para este email.");
            }
        } catch (e) {
            setEmailError("Erro ao verificar créditos. Tente novamente.");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleCreateAccount = () => {
        localStorage.setItem(
            "pendingDefenseData",
            JSON.stringify({
                formData,
                analysisData,
                source: "upload",
            })
        );
        navigate("/register?redirect=/upload/analysis");
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative p-6">
                <div className="text-center mb-4">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                        {isRecovering ? <Search size={32} /> : <Zap size={32} />}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                        {isRecovering ? "Recuperar Créditos" : "Adquirir Crédito Avulso"}
                    </h3>
                </div>

                {!isRecovering ? (
                    <>
                        <p className="text-gray-600 mb-6 text-center text-sm">
                            Por não possuir uma conta, o(s) crédito(s) ficarão salvos na sua sessão atual. Para garantir a segurança dos seus créditos e poder acessá-los futuramente de qualquer dispositivo, vincule um email abaixo.
                        </p>
                        
                        <div className="mb-6">
                            <label htmlFor="guestEmail" className="block text-sm font-medium text-gray-700 mb-2">
                                Email de vinculação
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    id="guestEmail"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    placeholder="exemplo@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleProceed}
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2">
                                Prosseguir para Adquirir <CheckCircle size={18} />
                            </button>
                            
                            <button
                                onClick={() => { setIsRecovering(true); setEmailError(''); setEmail(''); }}
                                className="w-full bg-blue-50 text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-100 transition-colors">
                                Já adquiri antes (Recuperar créditos)
                            </button>

                            <button
                                onClick={handleCreateAccount}
                                className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                Criar Conta Definitiva <User size={18} />
                            </button>

                            <button
                                onClick={onClose}
                                className="w-full text-gray-500 text-sm hover:text-gray-700 py-2">
                                Cancelar
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-gray-600 mb-6 text-center text-sm">
                            Informe o email utilizado na compra para verificar e recuperar seus créditos avulsos vinculados.
                        </p>

                        <div className="mb-6">
                            <label htmlFor="recoverEmail" className="block text-sm font-medium text-gray-700 mb-2">
                                Email vinculado aos créditos
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    id="recoverEmail"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    placeholder="exemplo@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleRecover}
                                disabled={isVerifying}
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50">
                                {isVerifying ? "Verificando..." : "Verificar Créditos"}
                            </button>

                            <button
                                onClick={() => { setIsRecovering(false); setEmailError(''); setEmail(''); }}
                                className="w-full text-gray-500 text-sm hover:text-gray-700 py-2">
                                Voltar
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};