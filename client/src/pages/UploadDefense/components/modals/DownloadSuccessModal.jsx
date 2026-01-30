import React from 'react';
import { Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DownloadSuccessModal = ({ onClose, btnText, onBtnClick }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onBtnClick) {
            onBtnClick();
        } else {
            onClose();
            navigate("/profile");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative p-8">
                <div className="text-center mb-6">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                        <Download size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Download Iniciado!</h2>
                </div>
                <p className="text-gray-600 text-center mb-8 leading-relaxed">
                    O arquivo PDF está sendo gerado.
                    <br/><br/>
                    Uma cópia segura também foi salva em <strong>"Minhas Defesas"</strong> no seu perfil, para que você possa baixar novamente quando precisar.
                </p>
                <button
                    onClick={handleClick}
                    className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg">
                    {btnText || "Ir para Minhas Defesas"}
                </button>
            </div>
        </div>
    );
};
