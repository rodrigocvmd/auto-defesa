import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import SEO from "../components/SEO";
import { Shield, HelpCircle, CheckCircle, ArrowRight, Share2, Check } from "lucide-react";
import { articles } from "../data/articles";
import { infractionData } from "../utils/infractionData";

const InfractionPage = () => {
	const { slug } = useParams();

	// Try to find in infractionData first, then in articles
	const rawData = infractionData[slug] || articles.find((article) => article.slug === slug);
	const data = rawData;
	const [copied, setCopied] = useState(false);

	const handleShare = () => {
		navigator.clipboard.writeText(window.location.href);
		setCopied(true);
		setTimeout(() => setCopied(false), 3000);
	};

	// Function to transform FAQ array into JSON-LD FAQPage schema
	const generateFaqSchema = (faq) => {
		if (!faq || faq.length === 0) return null;
		return {
			"@context": "https://schema.org",
			"@type": "FAQPage",
			mainEntity: faq.map((item) => ({
				"@type": "Question",
				name: item.q,
				acceptedAnswer: {
					"@type": "Answer",
					text: item.a,
				},
			})),
		};
	};

	const faqSchema = generateFaqSchema(data?.faq);

	const articleSchema = data
		? {
				"@context": "https://schema.org",
				"@type": "Article",
				headline: data.seoTitle || data.title,
				description: data.seoDescription || data.description,
				author: {
					"@type": "Person",
					name: "Rodrigo Carvalho",
					jobTitle: "Especialista em Direito de Trânsito",
				},
				image: "https://meuautodefesa.com.br/og-image.png",
				publisher: {
					"@type": "Organization",
					name: "Auto Defesa",
					logo: {
						"@type": "ImageObject",
						url: "https://meuautodefesa.com.br/favicon.jpeg",
					},
				},
				mainEntityOfPage: {
					"@type": "WebPage",
					"@id": `https://meuautodefesa.com.br/infracao/${data.slug}`,
				},
			}
		: null;

	const structuredData = [faqSchema, articleSchema].filter(Boolean);

	// Dynamic SEO strings focusing on the specific infraction pain points
	const pageTitle = data?.seoTitle || `Recurso de Multa ${data?.title} | Auto Defesa`;
	const pageDescription =
		data?.seoDescription ||
		`Multa de ${data?.title}? Inicie seu recurso agora. IA jurídica para anular pontos e multas do CTB com alta taxa de sucesso.`;

	// Estado para slug não encontrado (fallback genérico)
	if (!data) {
		return (
			<MainLayout>
				<SEO
					title="Recorra de Qualquer Multa de Trânsito | Auto Defesa"
					description="Recursos para todas as infrações do CTB. Inicie sua defesa com IA e proteja sua CNH hoje."
				/>
				<div className="bg-blue-50 py-20 px-4 text-center">
					<h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">Multa de Trânsito?</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
						Não encontrou a infração específica? Não se preocupe. O Auto Defesa cobre todas as
						infrações do Código de Trânsito Brasileiro.
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
			<SEO
				title={pageTitle}
				description={pageDescription}
				structuredData={structuredData}
				canonical={`/infracao/${data.slug}`}
			/>

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
							<p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mb-8">
								{data.description}
							</p>
							<div className="relative inline-block">
								<button
									onClick={handleShare}
									className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-bold text-sm bg-white border border-blue-200 px-4 py-2 rounded-xl shadow-sm hover:shadow-md">
									<Share2 size={18} /> Compartilhar esta página
								</button>
								{copied && (
									<div className="absolute -bottom-10 left-0 bg-gray-900 text-white text-[10px] px-2 py-1 rounded shadow-lg animate-in fade-in slide-in-from-top-1 flex items-center gap-1 whitespace-nowrap z-10">
										<Check size={10} /> Link para compartilhamento copiado com sucesso!
									</div>
								)}
							</div>
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
								{data.faq &&
									data.faq.map((item, index) => (
										<div
											key={index}
											className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
											<h3 className="text-lg font-bold text-gray-900 mb-3">{item.q}</h3>
											<p className="text-gray-600 leading-relaxed">{item.a}</p>
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
							<h3 className="text-2xl font-bold text-gray-900 mb-2">Não Pague Indevidamente</h3>
							<p className="text-gray-600 mb-8">
								Gere sua defesa técnica agora mesmo em poucos minutos.
							</p>

							<Link
								to="/upload"
								className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:-translate-y-1 mb-4">
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
