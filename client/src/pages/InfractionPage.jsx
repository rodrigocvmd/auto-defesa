import React from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import SEO from '../components/SEO';

const infractionData = {
  'lei-seca': { 
    title: 'Multa de Lei Seca (Art. 165)', 
    description: 'Saiba como anular a suspensão da CNH por dirigir sob influência de álcool.' 
  },
  'recusa-bafometro': { 
    title: 'Recusa ao Bafômetro (Art. 165-A)', 
    description: 'A recusa não significa culpa automática. Veja como se defender tecnicamente.' 
  },
  'excesso-velocidade': { 
    title: 'Excesso de Velocidade (Art. 218)', 
    description: 'Recorra de multas de radar com base em erros de aferição do Inmetro.' 
  },
  'ultrapassagem-indevida': {
    title: 'Ultrapassagem Indevida (Art. 203)',
    description: 'Multas por ultrapassagem podem ser revertidas com a análise correta da sinalização e local.'
  },
  'cnh-vencida': {
    title: 'CNH Vencida (Art. 162, V)',
    description: 'Evite problemas maiores por dirigir com a CNH vencida. Saiba como regularizar e recorrer.'
  },
  'celular-direcao': {
    title: 'Uso de Celular ao Volante (Art. 252)',
    description: 'Multas por uso de celular requerem prova clara de manuseio. Recorra agora.'
  },
  'manobra-perigosa': {
    title: 'Manobra Perigosa (Art. 175)',
    description: 'Infração gravíssima que suspende a CNH. Defenda-se e proteja seu direito de dirigir.'
  },
  'multa-moto': {
    title: 'Infrações de Moto (Capacete/Viseira)',
    description: 'Multas específicas para motociclistas muitas vezes possuem erros formais anuláveis.'
  },
  'perda-ppd': {
    title: 'Perda da PPD (Permissão para Dirigir)',
    description: 'Não perca sua habilitação provisória. É possível recorrer e manter sua PPD.'
  },
  'multa-nic': {
    title: 'Multa NIC (Não Indicação de Condutor)',
    description: 'Evite a multa multiplicada por não indicar o condutor em veículos PJ.'
  }
};

const InfractionPage = () => {
  const { slug } = useParams();
  const data = infractionData[slug];

  if (!data) {
    return (
      <MainLayout>
        <SEO 
          title="Recorra de Qualquer Multa de Trânsito | Auto Defesa" 
          description="O Auto Defesa suporta recursos para todas as infrações do Código de Trânsito Brasileiro (CTB). Inicie sua defesa agora."
        />
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Recorra de Qualquer Multa do CTB
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Nosso sistema de inteligência artificial está preparado para analisar e gerar defesas para todos os tipos de infração de trânsito no Brasil.
          </p>
          <Link 
            to="/upload" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all hover:shadow-lg hover:-translate-y-1"
          >
            Iniciar Análise Gratuita
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SEO title={data.title} description={data.description} />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
            {data.title}
          </h1>
          
          <div className="max-w-2xl mx-auto bg-blue-50 p-8 rounded-2xl border border-blue-100">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              {data.description}
            </p>
          </div>

          <div className="pt-8">
            <Link 
              to="/upload" 
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-4 px-10 rounded-xl transition-all hover:shadow-xl hover:-translate-y-1"
            >
              Criar Defesa para esta Infração
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              Análise preliminar sem compromisso • Tecnologia Gemini AI
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default InfractionPage;