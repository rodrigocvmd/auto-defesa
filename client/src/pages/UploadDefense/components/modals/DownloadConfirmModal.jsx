import React from 'react';
import { FileCheck } from 'lucide-react';

export const DownloadConfirmModal = ({ onClose, onConfirm }) => (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative p-8">
            <div className="text-center mb-6">
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600">
                    <FileCheck size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Confirmar Versão Final?</h2>
            </div>
            <p className="text-gray-600 text-center mb-8 leading-relaxed">
                Esta será a versão definitiva do seu recurso. <br/>
                Após o download, <strong>não será possível realizar novas alterações</strong> neste documento.
                <br/><br/>
                Você revisou todos os dados, a argumentação e tem certeza que está tudo correto?
            </p>
            <div className="flex flex-col gap-3">
                <button
                    onClick={onConfirm}
                    className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition-colors shadow-lg">
                    Sim, Confirmar e Baixar
                </button>
                <button
                    onClick={onClose}
                    className="w-full bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 py-3 rounded-xl transition-colors">
                    Voltar e Revisar
                </button>
            </div>
        </div>
    </div>
);
