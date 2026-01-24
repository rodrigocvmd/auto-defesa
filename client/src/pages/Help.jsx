import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { HelpCircle, Mail, Phone, MessageCircle, FileQuestion, ChevronDown, ChevronUp } from 'lucide-react';

const Help = () => {
  const faqs = [
    {
      q: "O recurso gerado é garantido que vou ganhar?",
      a: "Não. A obrigação é de meio, não de fim. Nossa IA utiliza as melhores teses jurídicas possíveis para o seu caso, aumentando significativamente suas chances de deferimento, mas a decisão final cabe exclusivamente ao órgão julgador (JARI/CETRAN)."
    },
    {
      q: "Preciso contratar um advogado para assinar?",
      a: "Não. Na esfera administrativa de trânsito, o próprio condutor ou proprietário pode assinar sua defesa. O documento que geramos já vem pronto com a fundamentação legal, dispensando a necessidade de advogado."
    },
    {
      q: "Os créditos expiram?",
      a: "Não! Se você comprar um pacote e não usar todos os créditos agora, eles ficam salvos na sua conta para sempre. Você pode usar quando precisar."
    },
    {
      q: "Serve para qual estado?",
      a: "Para todo o Brasil. A legislação de trânsito (CTB) é federal, portanto nossas defesas são válidas para órgãos de qualquer estado ou município."
    }
  ];

  const [openIndex, setOpenIndex] = React.useState(null);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Central de Ajuda</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Estamos aqui para te ajudar em cada etapa do processo.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="bg-green-100 p-4 rounded-full text-green-600 mb-4">
                    <MessageCircle size={32} />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">WhatsApp</h3>
                <p className="text-gray-500 mb-6 text-sm">Atendimento rápido para dúvidas sobre pagamentos ou uso da plataforma.</p>
                <button className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold w-full hover:bg-green-700 transition-colors">
                    (11) 99999-9999
                </button>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="bg-blue-100 p-4 rounded-full text-blue-600 mb-4">
                    <Mail size={32} />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">E-mail</h3>
                <p className="text-gray-500 mb-6 text-sm">Para questões mais complexas ou parcerias comerciais.</p>
                <a href="mailto:suporte@autodefesa.com.br" className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold w-full hover:bg-gray-800 transition-colors">
                    suporte@autodefesa.com.br
                </a>
            </div>
        </div>

        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <FileQuestion className="text-blue-600" /> Perguntas Frequentes
            </h2>
            <div className="space-y-4">
                {faqs.map((faq, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <button 
                            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                            className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-800 hover:bg-gray-50 transition-colors"
                        >
                            {faq.q}
                            {openIndex === idx ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                        </button>
                        {openIndex === idx && (
                            <div className="p-5 pt-0 text-gray-600 text-sm leading-relaxed border-t border-gray-100 mt-2">
                                {faq.a}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default Help;
