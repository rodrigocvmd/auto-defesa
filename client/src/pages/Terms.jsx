import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-8 transition-colors">
            <ArrowLeft size={20} className="mr-1" /> Voltar para Início
        </Link>
        
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-8 border-b pb-6">
                <Shield className="text-blue-600" size={32} />
                <h1 className="text-3xl font-black text-gray-900">Termos de Uso</h1>
            </div>

            <div className="prose prose-blue max-w-none text-gray-600">
                <p className="lead">Última atualização: 24 de Janeiro de 2026.</p>

                <h3>1. Aceitação dos Termos</h3>
                <p>Ao acessar e utilizar a plataforma AutoDefesa, você concorda integralmente com estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.</p>

                <h3>2. Descrição do Serviço</h3>
                <p>A AutoDefesa é uma plataforma tecnológica que utiliza inteligência artificial para auxiliar na elaboração de minutas de recursos administrativos de trânsito. <strong>NÃO somos um escritório de advocacia</strong> e não prestamos consultoria jurídica personalizada.</p>
                <p>O serviço limita-se a fornecer um documento base (minuta) fundamentado na legislação vigente, cabendo ao usuário a responsabilidade final pela revisão, assinatura e protocolo junto aos órgãos competentes.</p>

                <h3>3. Isenção de Garantia de Resultado</h3>
                <p>A elaboração do recurso constitui uma <strong>obrigação de meio, e não de fim</strong>. A AutoDefesa utiliza as melhores práticas e teses disponíveis para aumentar as chances de êxito, mas <strong>não garantimos o deferimento (aceitação) do recurso</strong>, pois a decisão cabe exclusivamente às autoridades de trânsito (JARI, CETRAN, etc.).</p>

                <h3>4. Responsabilidade do Usuário</h3>
                <p>O usuário declara que todas as informações fornecidas (dados pessoais, dados do veículo e relato dos fatos) são verdadeiras. A AutoDefesa não se responsabiliza por recursos indeferidos devido a informações falsas, incompletas ou prazos de protocolo perdidos pelo usuário.</p>

                <h3>5. Pagamentos e Créditos</h3>
                <p>O serviço opera no modelo de créditos pré-pagos. Os créditos adquiridos:</p>
                <ul>
                    <li>Não possuem data de validade (não expiram).</li>
                    <li>São consumidos apenas no momento da geração final do documento completo.</li>
                    <li>Não são reembolsáveis após a utilização (geração do documento), visto que o serviço foi prestado.</li>
                </ul>

                <h3>6. Demonstrações e Testes</h3>
                <p>As funcionalidades de demonstração gratuita podem utilizar modelos de inteligência artificial otimizados para velocidade (Standard), que podem ter precisão inferior aos modelos utilizados na versão paga (Pro/Advogado Virtual). A análise de viabilidade gratuita é apenas uma estimativa.</p>

                <h3>7. Alterações nos Termos</h3>
                <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão notificadas aos usuários.</p>

                <h3>8. Contato</h3>
                <p>Para dúvidas sobre estes termos, entre em contato através do e-mail: termos@autodefesa.com.br</p>
            </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Terms;