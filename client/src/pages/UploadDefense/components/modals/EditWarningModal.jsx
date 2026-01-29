import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const EditWarningModal = ({ onClose, onConfirm }) => (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="text-amber-500" /> Atenção na Edição
            </h3>
            <p className="text-gray-600 mb-6">
                Use a ferramenta de edição manual apenas para corrigir <strong>erros pontuais</strong>.
                Para alterar o conteúdo, recomendamos utilizar a <strong>IA de Refinamento</strong>.
            </p>
            <div className="flex justify-end gap-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">
                    Cancelar
                </button>
                <button
                    onClick={onConfirm}
                    className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
                    Entendi, quero editar
                </button>
            </div>
        </div>
    </div>
);
