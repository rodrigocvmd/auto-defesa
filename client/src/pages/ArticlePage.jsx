import React from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import SEO from "../components/SEO";
import { articles } from "../data/articles";
import { Shield, CheckCircle, ArrowRight, User, Calendar, Clock, Share2 } from "lucide-react";

const ArticlePage = ({ customSlug }) => {
	const { slug: urlSlug } = useParams();
	const slug = customSlug || urlSlug;
	const article = articles.find((a) => a.slug === slug);

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

	const faqSchema = generateFaqSchema(article?.faq);

	// Fallback se artigo não encontrado (poderia redirecionar para 404)
	if (!article) {
		return (
			<MainLayout>
				<div className="max-w-7xl mx-auto px-4 py-32 text-center">
					<h1 className="text-3xl font-bold text-gray-900 mb-4">Artigo não encontrado</h1>
					<Link to="/guia" className="text-blue-600 hover:underline">
						Voltar para o Guia
					</Link>
				</div>
			</MainLayout>
		);
	}

	return (
		<MainLayout>
			<SEO
				title={`${article.title} | Guia Auto Defesa`}
				description={article.description}
				structuredData={faqSchema}
			/>

			{/* Progress Bar (Visual) */}
			<div className="h-1 bg-gray-100 w-full sticky top-16 z-40">
				<div className="h-full bg-blue-600 w-1/3"></div> {/* Placeholder para scroll progress */}
			</div>

			<div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
					{/* Coluna Principal - Conteúdo */}
					<main className="lg:col-span-8">
						{/* Breadcrumbs */}
						<nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
							<Link to="/" className="hover:text-blue-600 transition-colors">
								Início
							</Link>
							<span>/</span>
							<Link to="/guia" className="hover:text-blue-600 transition-colors">
								Guia
							</Link>
							<span>/</span>
							<span className="text-gray-900 font-medium">{article.category}</span>
						</nav>

						{/* Header do Artigo */}
						<header className="mb-10">
							<div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
								<span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wide">
									{article.category}
								</span>
								<span className="flex items-center gap-1">
									<Calendar size={14} /> {article.publishDate}
								</span>
								<span className="flex items-center gap-1">
									<Clock size={14} /> 5 min de leitura
								</span>
							</div>

							<h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
								{article.title}
							</h1>

							<p className="text-xl text-gray-600 leading-relaxed mb-8 border-l-4 border-blue-600 pl-6">
								{article.description}
							</p>

							<div className="flex items-center justify-between border-y border-gray-100 py-6">
								<div className="flex items-center gap-3">
									<div className="bg-gray-200 p-2 rounded-full">
										<User size={20} className="text-gray-600" />
									</div>
									<div>
										<p className="text-sm font-bold text-gray-900">Rodrigo Carvalho</p>
										<p className="text-xs text-gray-600">Bacharel em Direito</p>
										<p className="text-xs text-gray-600">Especialista em Direito de Trânsito</p>
									</div>
								</div>
								<button className="text-gray-600 hover:text-blue-600 transition-colors">
									<Share2 size={20} />
								</button>
							</div>
						</header>

						{/* Conteúdo do Artigo */}
						<div className="prose prose-lg prose-blue max-w-none text-gray-700 space-y-8">
							{article.content}
						</div>

						{/* Outros Guias Úteis */}
						<div className="mt-12 pt-12 border-t border-gray-100">
							<h3 className="text-2xl font-bold text-gray-900 mb-6">
								Você também pode se interessar por:
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{articles
									.filter((a) => a.category === article.category && a.slug !== article.slug)
									.slice(0, 3)
									.map((related, idx) => (
										<Link
											key={idx}
											to={`/artigo/${related.slug}`}
											className="group bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all">
											<h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
												{related.title}
											</h4>
											<p className="text-sm text-gray-500 line-clamp-2">{related.description}</p>
										</Link>
									))}
							</div>
						</div>

						{/* FAQ Section do Artigo */}
						<div className="mt-12 pt-12 border-t border-gray-100">
							<h3 className="text-2xl font-bold text-gray-900 mb-6">Perguntas Frequentes</h3>
							<div className="space-y-4">
								{article.faq &&
									article.faq.map((item, idx) => (
										<div key={idx} className="bg-gray-50 rounded-xl p-6">
											<h4 className="font-bold text-gray-900 mb-2">{item.q}</h4>
											<p className="text-gray-600 text-sm">{item.a}</p>
										</div>
									))}
							</div>
						</div>

						{/* Bottom CTA */}
						<div className="mt-16 bg-blue-600 rounded-2xl p-8 md:p-12 text-center shadow-xl shadow-blue-200">
							<h2 className="text-3xl font-bold text-white mb-4">
								Não pague essa multa sem lutar!
							</h2>
							<p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
								Nossa IA já analisou milhares de casos como o seu. Gere uma defesa técnica
								personalizada em minutos.
							</p>
							<Link
								to="/upload"
								className="inline-block bg-white text-blue-600 font-bold py-4 px-10 rounded-xl hover:bg-gray-50 transition-all transform hover:-translate-y-1 shadow-lg">
								Gerar Defesa Agora
							</Link>
						</div>
					</main>

					{/* Sidebar (Desktop) */}
					<aside className="lg:col-span-4 space-y-8">
						{/* CTA Card Sticky */}
						<div className="sticky top-24">
							<div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 overflow-hidden relative">
								<div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
									RECOMENDADO
								</div>

								<div className="flex items-center gap-3 mb-4">
									<div className="bg-blue-100 p-2 rounded-lg text-blue-600">
										<Shield size={24} />
									</div>
									<h3 className="font-bold text-gray-900 text-lg">Análise Gratuita</h3>
								</div>

								<p className="text-gray-600 text-sm mb-6">
									Descubra agora se sua multa tem erros formais que permitem anulação.
								</p>

								<ul className="space-y-3 mb-6">
									<li className="flex items-center gap-2 text-sm text-gray-600">
										<CheckCircle size={16} className="text-green-500" /> Sem custo inicial
									</li>
									<li className="flex items-center gap-2 text-sm text-gray-600">
										<CheckCircle size={16} className="text-green-500" /> Resultado imediato
									</li>
									<li className="flex items-center gap-2 text-sm text-gray-600">
										<CheckCircle size={16} className="text-green-500" /> 100% Online
									</li>
								</ul>

								<Link
									to="/upload"
									className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-center transition-colors shadow-md">
									Verificar Minha Multa
								</Link>
							</div>

							{/* Related/Nav Links */}
							<div className="mt-8 bg-gray-50 rounded-2xl p-6 border border-gray-100">
								<h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">
									Outras Infrações
								</h4>
								<nav className="flex flex-col gap-2">
									<Link
										to="/artigo/lei-seca"
										className="text-sm text-gray-600 hover:text-blue-600 py-1 transition-colors border-b border-gray-200 border-dashed pb-1">
										Lei Seca
									</Link>
									<Link
										to="/artigo/excesso-velocidade"
										className="text-sm text-gray-600 hover:text-blue-600 py-1 transition-colors border-b border-gray-200 border-dashed pb-1">
										Excesso de Velocidade
									</Link>
									<Link
										to="/artigo/cnh-vencida"
										className="text-sm text-gray-600 hover:text-blue-600 py-1 transition-colors">
										CNH Vencida
									</Link>
								</nav>
							</div>
						</div>
					</aside>
				</div>
			</div>
		</MainLayout>
	);
};

export default ArticlePage;
