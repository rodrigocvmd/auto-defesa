import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const LimitExceededModal = ({ onClose, onProceed, step }) => (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="text-red-500" /> Limite de Testes Excedido
            </h3>
            <p className="text-gray-600 mb-6">
                Você atingiu o limite de utilizações gratuitas da nossa IA por hora. Para garantir a
                disponibilidade do serviço para todos, aguarde um pouco antes de tentar nova análise.
            </p>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                <p className="text-sm text-blue-800 font-medium">
                    Deseja pular a análise preliminar e ir direto para a elaboração do recurso final?
                    <br />
                    <span className="text-xs opacity-75">
                        (Isso permitirá mais uma verificação gratuita no processo final)
                    </span>
                </p>
            </div>
            <div className="flex flex-col gap-3">
                <button
                    onClick={onProceed}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">
                    Sim, prosseguir para análise
                </button>
                <button
                    onClick={onClose}
                    className="w-full bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 py-3 rounded-xl">
                    Aguardar e tentar depois
                </button>
            </div>
        </div>
    </div>
);
