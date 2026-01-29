import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

export const CodeNotFoundModal = ({ onClose, onManualEntry, setFormData }) => (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative p-8">
            <div className="text-center mb-6">
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600">
                    <AlertTriangle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Código não encontrado</h2>
            </div>
            <p className="text-gray-600 text-center mb-6">
                O código de infração informado não consta em nosso banco de dados. Sugerimos verificar se
                foi digitado corretamente.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 text-sm text-yellow-800">
                <p className="font-bold flex items-center gap-2 mb-2">
                    <Info size={16} /> Atenção:
                </p>
                <p>
                    Se optar por prosseguir manualmente, você deverá inserir o <strong>Amparo Legal</strong>{" "}
                    e a <strong>Descrição</strong> por conta própria.
                    <br />
                    <br />
                    Nossa IA fará a defesa baseada no que você escrever, o que{" "}
                    <strong>pode comprometer a qualidade técnica</strong> do recurso em comparação com
                    infrações validadas pelo nosso sistema.
                </p>
            </div>

            <div className="flex flex-col gap-3">
                <button
                    onClick={() => {
                        onClose();
                        setFormData((prev) => ({ ...prev, infractionCode: "", infractionSplit: "" }));
                    }}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">
                    Corrigir Código
                </button>
                <button
                    onClick={() => {
                        onManualEntry();
                        onClose();
                    }}
                    className="w-full bg-white border border-gray-300 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                    Manter código e preencher manualmente
                </button>
            </div>
        </div>
    </div>
);
