import React from 'react';
import MainLayout from '../layouts/MainLayout';

const Terms = () => {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Termos de Uso</h1>
        <div className="prose text-gray-600 space-y-4">
          <p>Última atualização: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-bold text-gray-800">1. Aceitação</h2>
          <p>Ao utilizar o Auto Defesa, você concorda com estes termos. O serviço utiliza Inteligência Artificial para gerar minutas de defesa de trânsito.</p>

          <h2 className="text-xl font-bold text-gray-800">2. Natureza do Serviço</h2>
          <p>O Auto Defesa é uma ferramenta auxiliar. <strong>Não somos um escritório de advocacia.</strong> O documento gerado é uma sugestão técnica baseada nos dados fornecidos. A responsabilidade pelo protocolo, prazos e veracidade das informações é exclusivamente do usuário.</p>

          <h2 className="text-xl font-bold text-gray-800">3. Isenção de Responsabilidade</h2>
          <p>Não garantimos o deferimento (aceitação) do recurso pelos órgãos de trânsito, pois isso depende da interpretação subjetiva dos julgadores da JARI.</p>

          <h2 className="text-xl font-bold text-gray-800">4. Uso de Dados</h2>
          <p>As informações inseridas são processadas temporariamente para a geração do documento. Consulte nossa Política de Privacidade para mais detalhes.</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Terms;
