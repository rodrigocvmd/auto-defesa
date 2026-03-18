import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DivergenceWarningModal = ({ onClose, analysisData }) => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative p-8">
                <div className="text-center mb-6">
                    <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                        <AlertTriangle size={32} />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900">Contradição Identificada</h2>
                </div>

                <div className="space-y-4 text-gray-600 mb-8 text-left">
                    <p>
                        Foi identificada uma inconsistência severa entre o seu <strong>relato</strong> e a{" "}
                        <strong>materialidade da infração</strong>.
                    </p>

                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                        <p className="text-sm font-bold text-red-800 mb-1">Qual é a contradição:</p>

                        <p className="text-sm text-red-700 italic">"{analysisData?.divergence?.message}"</p>
                    </div>

                    <p className="text-sm text-center">
                        <strong>Atenção:</strong> Manter essas informações pode{" "}
                        <strong>não ser positivo</strong> para o recurso, proporcionando inconsistências
                        jurídicas e limitando significativamente os argumentos de defesa que a IA poderá
                        utilizar.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={onClose}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">
                        Alterar Relato (Recomendado)
                    </button>

                    <button
                        onClick={() => {
                            onClose();
                            navigate("/upload/analysis");
                        }}
                        className="w-full bg-white border border-gray-300 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                        Manter como está...
                    </button>
                </div>
            </div>
        </div>
    );
};
