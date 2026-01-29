import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PhaseConfirmationStep = ({ formData }) => {
    const navigate = useNavigate();
    
    const typeLabels = {
        previa: "Defesa Prévia",
        jari: "Recurso à JARI",
        cetran: "Recurso ao CETRAN",
    };
    const detectedLabel = typeLabels[formData.defenseType] || formData.defenseType;

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 text-center p-8 animate-in slide-in-from-bottom-4">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <CheckCircle size={40} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Fase Identificada!</h2>
                <p className="text-gray-600 mb-8">
                    Nossa IA analisou seu documento e identificou que se trata de uma:
                    <br />
                    <span className="text-2xl font-bold text-blue-600 mt-2 block">{detectedLabel}</span>
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => navigate("/upload/form")}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg">
                        Correto, prosseguir com {detectedLabel}
                    </button>
                    <button
                        onClick={() => navigate("/upload/phaseSelection")}
                        className="text-gray-500 font-medium hover:text-gray-700 py-2">
                        Não, escolher outra fase manualmente
                    </button>
                </div>
            </div>
        </div>
    );
};
