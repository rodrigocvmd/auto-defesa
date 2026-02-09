import React from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import SEO from "../components/SEO";
import { Shield, HelpCircle, CheckCircle, ArrowRight } from "lucide-react";
import { articles } from "../data/articles";

const InfractionPage = () => {
	const { slug } = useParams();
	const data = articles.find(article => article.slug === slug);

	// Estado para slug não encontrado (fallback genérico)
	if (!data) {
		return (
			<MainLayout>
				<SEO
					title="Recorra de Qualquer Multa de Trânsito | Auto Defesa"
					description="Recursos para todas as infrações do CTB. Inicie sua defesa com IA."
				/>
				<div className="bg-blue-50 py-20 px-4 text-center">
					<h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">
						Multa de Trânsito?
					</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
						Não encontrou a infração específica? Não se preocupe. O Auto Defesa cobre todas as infrações do Código de Trânsito Brasileiro.
					</p>
					<Link
						to="/upload"
						className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:-translate-y-1">
						Iniciar Análise Gratuita <ArrowRight size={20} />
					</Link>
				</div>
			</MainLayout>
		);
	}

	return (
		<MainLayout>
			<SEO title={data.title} description={data.description} />
			
			{/* Hero Section */}
			<div className="bg-blue-50 border-b border-blue-100">
				<div className="max-w-7xl mx-auto px-4 py-16 md:py-20">
					<div className="flex flex-col md:flex-row items-start justify-between gap-8">
						<div className="max-w-3xl">
							<div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold mb-6">
								<Shield size={16} /> Defesa Especializada
							</div>
							<h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
								{data.title}
							</h1>
							<p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
								{data.description}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 pt-10 pb-2">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
					
					{/* Coluna Principal */}
					<div className="lg:col-span-2 space-y-12">
						{/* Seção FAQ */}
						<section>
							<h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
								<HelpCircle className="text-blue-600" /> Perguntas Frequentes
							</h2>
							<div className="space-y-6">
								{data.faq && data.faq.map((item, index) => (
									<div key={index} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
										<h3 className="text-lg font-bold text-gray-900 mb-3">
											{item.q}
										</h3>
										<p className="text-gray-600 leading-relaxed">
											{item.a}
										</p>
									</div>
								))}
							</div>
						</section>

						{/* Benefícios Genéricos */}
						<section className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
							<h3 className="text-xl font-bold text-gray-900 mb-6">Por que usar o Auto Defesa?</h3>
							<ul className="space-y-4">
								<li className="flex items-start gap-3 text-gray-700">
									<CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
									<span>Análise instantânea baseada em inteligência artificial avançada.</span>
								</li>
								<li className="flex items-start gap-3 text-gray-700">
									<CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
									<span>Fundamentação jurídica personalizada para o seu caso específico.</span>
								</li>
								<li className="flex items-start gap-3 text-gray-700">
									<CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
									<span>Economia de tempo e dinheiro comparado a escritórios tradicionais.</span>
								</li>
							</ul>
						</section>
					</div>

					{/* Sidebar de Conversão */}
					<div className="lg:col-span-1">
						<div className="sticky top-24 bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
							<div className="mb-6 inline-flex justify-center bg-blue-100 p-4 rounded-full text-blue-600">
								<Shield size={40} />
							</div>
							<h3 className="text-2xl font-bold text-gray-900 mb-2">
								Não Pague Indevidamente
							</h3>
							<p className="text-gray-600 mb-8">
								Gere sua defesa técnica agora mesmo em poucos minutos.
							</p>
							
							<Link
								to="/upload"
								className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:-translate-y-1 mb-4"
							>
								Gerar Minha Defesa Técnica
							</Link>
							
							<p className="text-xs text-gray-600">
								Satisfação garantida ou revisão gratuita do recurso.
							</p>
						</div>
					</div>

				</div>
			</div>
		</MainLayout>
	);
};

export default InfractionPage;