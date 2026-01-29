import React from 'react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LoginPromptModal = ({ onClose, formData, source }) => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative p-6">
                <div className="text-center mb-4">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                        <User size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Limite Gratuito Atingido</h3>
                </div>
                <p className="text-gray-600 mb-6 text-center">
                    Você atingiu o limite de 3 testes gratuitos como visitante.
                    <br />
                    <br />
                    <strong>Crie sua conta ou faça login</strong> para continuar utilizando nossas ferramentas
                    e desbloquear mais limites.
                </p>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => {
                            localStorage.setItem(
                                "pendingDefenseData",
                                JSON.stringify({ formData, source: source || "upload" }),
                            );
                            navigate("/register?redirect=/upload");
                        }}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">
                        Criar Conta Grátis
                    </button>
                    <button
                        onClick={() => {
                            localStorage.setItem(
                                "pendingDefenseData",
                                JSON.stringify({ formData, source: source || "upload" }),
                            );
                            navigate("/login?redirect=/upload");
                        }}
                        className="w-full bg-white border border-gray-300 text-blue-600 font-bold py-3 rounded-xl hover:bg-gray-50">
                        Já tenho conta
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full text-gray-400 text-sm hover:text-gray-600 py-2">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};
