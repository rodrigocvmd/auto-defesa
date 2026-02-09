import React from 'react';
import { X, HelpCircle, FileWarning, Gavel, Scale, ArrowDown } from 'lucide-react';

export const HelpModal = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} className="text-gray-600" />
            </button>
            <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
                    <HelpCircle className="text-blue-600" /> Entenda as Fases da Defesa
                </h2>
                <div className="space-y-4">
                    <div className="p-6 bg-yellow-50 rounded-2xl border border-yellow-100 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="font-bold text-lg text-yellow-900 mb-3 flex items-center gap-2">
                            <FileWarning size={28} /> 1. Defesa Prévia (Autuação)
                        </h3>
                        <p className="text-MD text-yellow-800 leading-relaxed">
                            É a primeira oportunidade de defesa, quando você recebe a{" "}
                            <strong>Notificação de Autuação</strong> (ainda sem código de barras para
                            pagamento).
                            <br />
                            <br />
                            <strong>Objetivo:</strong> Apontar <strong>erros formais</strong> (ex: placa errada,
                            cor do veículo divergente, local inexistente) para anular a infração antes que ela
                            se torne uma penalidade (multa).
                        </p>
                    </div>
                    <div className="flex justify-center text-gray-600">
                        <ArrowDown size={32} />
                    </div>
                    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="font-bold text-lg text-blue-900 mb-3 flex items-center gap-2">
                            <Gavel size={28} /> 2. Recurso à JARI (1ª Instância)
                        </h3>
                        <p className="text-md text-blue-800 leading-relaxed">
                            Deve ser apresentado quando você já recebeu a{" "}
                            <strong>Notificação de Penalidade</strong> (o boleto com valor a pagar) ou teve a
                            Defesa Prévia indeferida.
                            <br />
                            <br />
                            <strong>Objetivo:</strong> Discutir o <strong>mérito da infração</strong>. Aqui
                            argumentamos se a infração realmente ocorreu ou se houve justificativa legal,
                            contestando a aplicação da penalidade.
                        </p>
                    </div>
                    <div className="flex justify-center text-gray-600">
                        <ArrowDown size={32} />
                    </div>
                    <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="font-bold text-lg text-purple-900 mb-3 flex items-center gap-2">
                            <Scale size={34} /> 3. Recurso ao CETRAN (2ª Instância)
                        </h3>
                        <p className="text-md text-purple-800 leading-relaxed">
                            É a última tentativa na esfera administrativa, cabível apenas se o seu{" "}
                            <strong>Recurso à JARI foi negado</strong>.<br />
                            <br />
                            <strong>Objetivo:</strong> Levar o caso para um colegiado superior (Conselho
                            Estadual de Trânsito) para reavaliar a decisão da JARI.
                        </p>
                    </div>
                </div>
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={onClose}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl active:scale-95">
                        Entendi, obrigado!
                    </button>
                </div>
            </div>
        </div>
    </div>
);
