import React from 'react';
import MainLayout from '../layouts/MainLayout';

const Privacy = () => {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Política de Privacidade</h1>
        <div className="prose text-gray-600 space-y-4">
          <p>Última atualização: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-bold text-gray-800">1. Coleta de Dados</h2>
          <p>Coletamos dados pessoais (Nome, CPF, CNH) e do veículo estritamente para a finalidade de preenchimento automático das defesas e recursos de trânsito.</p>

          <h2 className="text-xl font-bold text-gray-800">2. Processamento via IA</h2>
          <p>Os dados inseridos no formulário são enviados para processamento em nuvem (Google Gemini API). Não utilizamos seus dados para treinar modelos públicos sem seu consentimento explícito.</p>

          <h2 className="text-xl font-bold text-gray-800">3. Armazenamento</h2>
          <p>Atualmente, o Auto Defesa opera em modo MVP. Dados enviados podem ser registrados em logs de servidor para fins de depuração e melhoria do serviço.</p>

          <h2 className="text-xl font-bold text-gray-800">4. Seus Direitos</h2>
          <p>Você pode solicitar a exclusão de quaisquer dados associados ao seu uso da plataforma entrando em contato com o suporte.</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Privacy;
