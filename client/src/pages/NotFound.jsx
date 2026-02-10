import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Upload, User, ArrowLeft } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import SEO from '../components/SEO';

const NotFound = () => {
  return (
    <MainLayout>
      <SEO 
        title="Página Não Encontrada | Auto Defesa"
        description="A página que você está procurando não existe ou foi movida."
        noIndex={true}
      />
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="mb-8 flex justify-center">
          <div className="bg-blue-50 p-6 rounded-full animate-bounce duration-[3000ms]">
            <FileQuestion className="w-20 h-20 text-blue-600" />
          </div>
        </div>
        
        <h1 className="text-6xl font-black text-gray-900 mb-4 tracking-tight">
          404
        </h1>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Ops! Página não encontrada.
        </h2>
        
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Parece que você pegou o caminho errado. A página que você está procurando não existe ou foi movida para um novo endereço.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Link
            to="/upload"
            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95 order-1 sm:order-1"
          >
            <Upload className="w-6 h-6" />
            <span>Gerar Recurso</span>
          </Link>
          
          <Link
            to="/profile"
            className="flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold py-4 px-8 rounded-2xl transition-all active:scale-95 order-2 sm:order-2"
          >
            <User className="w-6 h-6" />
            <span>Meu Perfil</span>
          </Link>
        </div>
        
        <div className="mt-16">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:underline font-bold">
            <ArrowLeft size={18} /> Voltar para o Início
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
