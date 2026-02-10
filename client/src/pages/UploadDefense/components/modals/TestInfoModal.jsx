import React from 'react';
import { Info, X, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TestInfoModal = ({ onClose, onConfirm }) => {
    const navigate = useNavigate();
    
    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative p-8">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
                    <X size={24} />
                </button>
                <div className="text-center mb-6">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                        <Info size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Modo de Demonstração</h2>
                </div>
                <p className="text-gray-600 text-center mb-8 leading-relaxed">
                    Você escolheu preencher com <strong>Dados de Exemplo</strong>. Isso permite que você veja
                    a inteligência artificial em ação sem precisar digitar seus dados agora.
                    <br />
                    <br />
                    <strong>Nota:</strong> Esta demonstração utiliza o modelo <em>Standard</em>. A versão paga
                    utiliza o modelo <em>Pro</em>, treinado com jurisprudência avançada.
                    <br />
                    <br />
                    Os créditos <strong>NÃO</strong> serão cobrados nesta simulação e o recurso final não
                    poderá ser desbloqueado até que você use dados reais.
                </p>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onConfirm}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">
                        Entendi, prosseguir com Teste
                    </button>
                    <button
                        onClick={() => navigate("/upload")}
                        className="w-full bg-blue-50 text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                        <Upload size={18} /> Extrair dados da minha multa
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">
                        Cancelar, vou usar meus dados
                    </button>
                </div>
            </div>
        </div>
    );
};
