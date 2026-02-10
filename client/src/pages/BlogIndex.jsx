import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import SEO from '../components/SEO';
import { articles } from '../data/articles';
import { ArrowRight, BookOpen } from 'lucide-react';

const BlogIndex = () => {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Central de Defesa - Guia Auto Defesa",
    "description": "Artigos técnicos e guias para proteger sua CNH",
    "author": {
      "@type": "Person",
      "name": "Rodrigo Carvalho",
      "jobTitle": "Especialista em Direito de Trânsito"
    }
  };

  return (
    <MainLayout>
      <SEO 
        title="Guia de Multas e Defesa de CNH | Auto Defesa" 
        description="Acesse nosso guia completo sobre multas de trânsito. Artigos técnicos e atualizados para te ajudar a recorrer e proteger sua CNH." 
        structuredData={blogSchema}
      />
      
      {/* Header */}
      <div className="bg-blue-50 py-16 text-center border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-6 text-blue-600">
            <BookOpen size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Central de Defesa
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Artigos técnicos e guias para proteger sua CNH
          </p>
        </div>
      </div>

      {/* Grid de Artigos */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div key={article.slug} className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all h-full">
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wide">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-600">
                    {article.publishDate}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                  {article.description}
                </p>
                
                <Link 
                  to={`/artigo/${article.slug}`} 
                  className="inline-flex items-center text-blue-600 font-bold text-sm hover:text-blue-800 transition-colors group"
                >
                  Ler Artigo <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="max-w-5xl mx-auto px-4 pb-6">
        <div className="bg-blue-600 rounded-3xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-blue-200">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Não encontrou o que procurava?
            </h2>
            <p className="text-blue-100 text-lg">
              Nossa IA analisa qualquer tipo de infração em segundos.
            </p>
          </div>
          <Link 
            to="/upload" 
            className="bg-white text-blue-600 font-bold py-4 px-8 rounded-xl hover:bg-gray-50 transition-colors shadow-lg whitespace-nowrap"
          >
            Recorrer Agora
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default BlogIndex;
