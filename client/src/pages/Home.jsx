import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileText, ArrowRight, Gavel, CheckCircle } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

const Home = () => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Recorra de multas <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              em segundos com IA
            </span>
          </h1>
          <p className="text-lg text-gray-600 md:text-xl max-w-lg mx-auto">
            Utilizamos inteligência artificial para analisar sua infração e gerar uma defesa técnica baseada na legislação vigente.
          </p>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          
          {/* Opção 1: Upload */}
          <Link to="/upload" className="group relative bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-blue-100 hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Upload size={120} />
            </div>
            <div className="relative z-10 flex flex-col items-start h-full">
              <div className="p-3 bg-blue-100 rounded-lg text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <Upload size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Upload da Notificação</h3>
              <p className="text-gray-500 mb-6 flex-1">
                Envie a foto ou PDF da multa. Nossa IA extrai os dados e monta a defesa automaticamente.
              </p>
              <div className="flex items-center font-semibold text-blue-600 group-hover:gap-2 transition-all">
                Começar agora <ArrowRight size={20} className="ml-1" />
              </div>
            </div>
          </Link>

          {/* Opção 2: Manual */}
          <Link to="/manual-defense" className="group relative bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-indigo-100 hover:shadow-xl transition-all duration-300">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <FileText size={120} />
            </div>
            <div className="relative z-10 flex flex-col items-start h-full">
              <div className="p-3 bg-gray-100 rounded-lg text-gray-700 mb-4 group-hover:scale-110 transition-transform">
                <FileText size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Preenchimento Manual</h3>
              <p className="text-gray-500 mb-6 flex-1">
                Não tem o arquivo? Digite os detalhes da infração e o Artigo do CTB.
              </p>
              <div className="flex items-center font-semibold text-gray-700 group-hover:text-indigo-600 group-hover:gap-2 transition-all">
                Preencher formulário <ArrowRight size={20} className="ml-1" />
              </div>
            </div>
          </Link>

        </div>

        {/* Features / Trust */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-sm text-gray-500 mt-8">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle size={16} className="text-green-500" /> Baseado no CTB
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle size={16} className="text-green-500" /> IA Jurídica Especializada
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle size={16} className="text-green-500" /> Geração Instantânea
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default Home;