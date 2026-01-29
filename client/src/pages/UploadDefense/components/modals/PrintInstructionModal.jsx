import React from 'react';
import { Download, FileText, CheckCircle, Info, ArrowDown } from 'lucide-react';

export const PrintInstructionModal = ({ onClose, onPrint }) => (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative p-8">
            <div className="text-center mb-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                    <Download size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Salvar ou Imprimir</h2>
            </div>
            
            <div className="space-y-4 mb-8">
                <p className="text-gray-600 text-center text-sm">
                    Utilizaremos a função de impressão do seu navegador para gerar um arquivo leve e com texto nítido.
                </p>

                <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl text-xs text-amber-800 leading-relaxed">
                    <p>
                        <strong>Dica:</strong> Você poderá verificar a formatação final na janela que se abrirá. Se precisar ajustar algo, basta fechá-la, editar o texto e clicar em baixar novamente.
                    </p>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 space-y-4">
                    <div>
                        <p className="font-bold text-blue-700 mb-1 flex items-center gap-2">
                            <FileText size={16}/> Para Salvar o Arquivo (PDF):
                        </p>
                        <ol className="list-decimal list-inside space-y-1 ml-1 text-xs text-gray-600">
                            <li>Em <strong>Destino</strong>, selecione <strong>"Salvar como PDF"</strong>.</li>
                            <li>Clique em <strong>Salvar</strong>.</li>
                        </ol>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3">
                        <p className="font-bold text-gray-700 mb-1 flex items-center gap-2">
                            <CheckCircle size={16}/> Para Imprimir Diretamente:
                        </p>
                        <ol className="list-decimal list-inside space-y-1 ml-1 text-xs text-gray-600">
                            <li>Selecione sua <strong>Impressora</strong> na lista.</li>
                            <li>Clique em <strong>Imprimir</strong>.</li>
                        </ol>
                    </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-800 text-center font-medium">
                    <Info size={14} className="inline mr-1 -mt-0.5"/>
                    O arquivo também ficará salvo no seu <strong>Histórico</strong> para acesso futuro.
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <button
                    onClick={onPrint}
                    className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
                    Entendi, Abrir Janela <ArrowDown size={20} />
                </button>
                <button
                    onClick={onClose}
                    className="w-full text-gray-500 font-medium hover:bg-gray-100 py-3 rounded-xl transition-colors">
                    Cancelar
                </button>
            </div>
        </div>
    </div>
);
