import React, { useState, useMemo } from 'react';
import MainLayout from '../layouts/MainLayout';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, Minus, Plus, ShieldCheck, Info } from 'lucide-react';

const Tools = () => {
  return (
    <MainLayout>
      <SEO 
        title="Ferramentas Úteis | Auto Defesa" 
        description="Ferramentas gratuitas para motoristas: Calculadora de Pontos CNH e mais."
      />
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Ferramentas para <span className="text-blue-600">Motoristas</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Desenvolvemos utilitários gratuitos para ajudar você a entender sua situação e proteger seu direito de dirigir.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link 
            to="/calculadora-pontos" 
            className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2"
          >
            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Calculadora de Pontos CNH</h2>
            <p className="text-gray-600 mb-6">
              Verifique o limite de pontos da sua carteira e descubra o risco de suspensão com base nas novas regras do CTB.
            </p>
            <span className="flex items-center gap-2 text-blue-600 font-bold">
              Acessar Calculadora <ArrowRight size={18} />
            </span>
          </Link>
          
          {/* Placeholder para futuras ferramentas */}
          <div className="bg-gray-50 rounded-3xl p-8 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center opacity-60">
            <div className="bg-gray-200 w-16 h-16 rounded-2xl flex items-center justify-center text-gray-400 mb-6">
              <Plus size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-400">Em Breve</h2>
            <p className="text-gray-400">
              Novas ferramentas estão sendo preparadas pela nossa equipe.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Tools;
