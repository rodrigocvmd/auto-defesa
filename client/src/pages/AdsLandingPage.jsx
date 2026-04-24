import React from "react";
import { useParams, Link } from "react-router-dom";
import CleanLayout from "../layouts/CleanLayout";
import SEO from "../components/SEO";
import { infractionData } from "../utils/infractionData";
import { 
	CheckCircle, 
	ArrowRight, 
	ShieldCheck, 
	Zap, 
	Clock, 
	AlertTriangle, 
	Ban, 
	TrendingUp, 
	FileText, 
	Smartphone, 
	Star 
} from "lucide-react";
import Testimonials from "../components/Testimonials";

const ICON_MAP = {
	AlertTriangle: AlertTriangle,
	Ban: Ban,
	TrendingUp: TrendingUp,
	FileText: FileText,
	Smartphone: Smartphone,
	CheckCircle: CheckCircle,
	ShieldCheck: ShieldCheck,
	Zap: Zap
};

const AdsLandingPage = () => {
	const { slug } = useParams();
	const data = infractionData[slug];

	if (!data) {
		return (
			<CleanLayout>
				<div className="text-center py-20 px-4">
					<h1 className="text-2xl font-bold text-gray-800">Página não encontrada</h1>
					<Link to="/" className="text-blue-600 mt-4 inline-block underline font-medium">
						Voltar para o início
					</Link>
				</div>
			</CleanLayout>
		);
	}

	const aggressiveTitle = `Recurso de Multa ${data.title.replace("Recurso de Multa ", "").replace("Multa ", "")} - Rápido e Profissional`;
	
	const seoTitle = data.seoTitle || aggressiveTitle;
	const seoDesc = data.seoDescription || `Evite a suspensão da sua CNH! Defesa especializada para ${data.title}. Tecnologia de IA para identificar falhas técnicas e anular sua multa.`;

	return (
		<CleanLayout>
			<SEO
				title={seoTitle}
				description={seoDesc}
				keywords={`recurso multa, ${slug}, defesa cnh, anular multa`}
			/>

			<div className="space-y-0 bg-gray-50">
				{/* Fold 1: Hero (Above the Fold) */}
				<section className="text-center px-4 py-10 md:py-16 bg-gradient-to-b from-white to-gray-50 border-b border-gray-100">
					<div className="max-w-4xl mx-auto space-y-6">
						{data.alertTag && (
							<div className="inline-flex items-center justify-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-bold border border-red-200 animate-pulse">
								<Clock size={16} /> {data.alertTag}
							</div>
						)}
						{!data.alertTag && (
							<div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
								<Zap size={16} /> Oportunidade: Recurso Gerado por IA Pro
							</div>
						)}

						<h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tight">
							{data.title}
						</h1>

						<div className="flex items-center justify-center gap-2 text-yellow-500 pb-2">
							<div className="flex">
								{[...Array(5)].map((_, i) => (
									<Star key={i} size={20} fill="currentColor" />
								))}
							</div>
							<span className="text-gray-700 font-bold text-sm md:text-base">4.9/5 <span className="font-normal text-gray-500">(+1.200 recursos gerados)</span></span>
						</div>

						<p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
							{data.description}
						</p>
						
						{data.benefits && (
							<div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 pt-4">
								{data.benefits.map((benefit, idx) => (
									<span key={idx} className="flex items-center justify-center w-full sm:w-auto gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm md:text-base font-semibold border border-green-200 shadow-sm">
										<CheckCircle size={18} /> {benefit}
									</span>
								))}
							</div>
						)}

						<div className="flex flex-col items-center justify-center gap-4 pt-8">
							<Link
								to="/upload"
								className="w-full sm:w-auto bg-green-600 text-white text-xl md:text-2xl font-black px-8 py-5 rounded-2xl shadow-[0_8px_30px_rgb(22,163,74,0.3)] hover:bg-green-700 hover:scale-105 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
								{data.ctaText || "Começar Recurso Agora"} <ArrowRight size={28} />
							</Link>
							<p className="text-sm text-gray-500 flex items-center justify-center gap-1 font-medium">
								<ShieldCheck size={16} className="text-green-600" /> Análise inicial 100% segura e sem compromisso
							</p>
						</div>
					</div>
				</section>

				{/* Fold 2: Agitação da Dor */}
				{data.painPoints && (
					<section className="py-12 md:py-20 bg-white">
						<div className="max-w-5xl mx-auto px-4 space-y-10">
							<div className="text-center space-y-4">
								<h2 className="text-2xl md:text-4xl font-black text-gray-900">
									O que acontece se você <span className="text-red-600">apenas pagar</span> a multa?
								</h2>
								<p className="text-gray-600 md:text-lg">Pagar a multa é confessar a infração. Veja as consequências reais:</p>
							</div>
							
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{data.painPoints.map((pain, idx) => {
									const Icon = ICON_MAP[pain.icon] || AlertTriangle;
									return (
										<div key={idx} className="bg-red-50 border border-red-100 p-6 md:p-8 rounded-3xl relative overflow-hidden group hover:shadow-lg transition-all">
											<div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
											<div className="relative z-10 space-y-4">
												<div className="bg-red-100 text-red-600 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm">
													<Icon size={28} strokeWidth={2.5} />
												</div>
												<h3 className="text-xl font-bold text-gray-900">{pain.title}</h3>
												<p className="text-gray-600 leading-relaxed">{pain.desc}</p>
											</div>
										</div>
									);
								})}
							</div>

							<div className="text-center pt-6">
								<Link to="/upload" className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1">
									Não quero correr esse risco. Quero recorrer agora <ArrowRight size={16} />
								</Link>
							</div>
						</div>
					</section>
				)}

				{/* Fold 3: Como Funciona (Método) */}
				{data.howItWorks && (
					<section className="py-12 md:py-20 bg-gray-900 text-white">
						<div className="max-w-5xl mx-auto px-4 space-y-12">
							<div className="text-center space-y-4">
								<h2 className="text-2xl md:text-4xl font-black">
									Como nossa IA anula sua multa em <span className="text-blue-400">3 passos</span>
								</h2>
								<p className="text-gray-400 md:text-lg">Sem burocracia, sem termos difíceis. Nós fazemos o trabalho duro.</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
								{/* Conector Line (Desktop) */}
								<div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-900 via-blue-500 to-blue-900 z-0"></div>
								
								{data.howItWorks.map((step, idx) => (
									<div key={idx} className="relative z-10 flex flex-col items-center text-center space-y-4">
										<div className="w-24 h-24 bg-gray-800 border-4 border-gray-900 outline outline-4 outline-blue-600/30 rounded-full flex items-center justify-center text-3xl font-black shadow-2xl">
											{step.step}
										</div>
										<h3 className="text-xl font-bold text-white">{step.title}</h3>
										<p className="text-gray-400 leading-relaxed max-w-xs">{step.desc}</p>
									</div>
								))}
							</div>
						</div>
					</section>
				)}

				{/* Fold 4: Testimonials (Prova Social) */}
				<div className="bg-white">
					<Testimonials />
				</div>

				{/* Fold 5: FAQ */}
				<section className="py-12 md:py-20 bg-gray-50 border-t border-gray-100">
					<div className="max-w-3xl mx-auto px-4 space-y-10">
						<div className="text-center space-y-4">
							<h2 className="text-2xl md:text-4xl font-black text-gray-900">Ainda tem dúvidas?</h2>
							<p className="text-gray-600 md:text-lg">Tudo o que você precisa saber antes de gerar seu recurso.</p>
						</div>
						
						<div className="space-y-4">
							{data.faq.map((item, idx) => (
								<div key={idx} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
									<h4 className="text-lg md:text-xl font-bold text-gray-900 mb-3 flex items-start gap-3">
										<div className="min-w-[8px] h-2 bg-blue-600 rounded-full mt-2.5"></div>
										{item.q}
									</h4>
									<p className="text-gray-600 leading-relaxed pl-5">{item.a}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Fold 6: CTA Final */}
				<section className="py-12 md:py-20 bg-white">
					<div className="max-w-4xl mx-auto px-4">
						<div className="bg-gradient-to-br from-blue-900 to-gray-900 rounded-[2rem] p-8 md:p-14 text-center text-white space-y-8 shadow-2xl relative overflow-hidden">
							{/* Background effects */}
							<div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none"></div>
							<div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/20 blur-3xl rounded-full -ml-32 -mb-32 pointer-events-none"></div>
							
							<div className="relative z-10 space-y-6">
								<div className="inline-flex items-center gap-2 bg-red-500/20 text-red-100 border border-red-500/30 px-4 py-1.5 rounded-full text-sm font-bold animate-pulse">
									<Clock size={16} /> O prazo está correndo
								</div>
								
								<h2 className="text-3xl md:text-5xl font-black leading-tight">
									Não deixe o sistema tirar o seu direito de dirigir.
								</h2>
								<p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
									Milhares de multas são anuladas todos os anos por erros técnicos que só uma análise
									profissional identifica. Exerça seu direito de defesa agora.
								</p>
								
								<div className="pt-4 flex flex-col items-center gap-4">
									<Link
										to="/upload"
										className="w-full sm:w-auto bg-green-500 text-white text-xl md:text-2xl font-black px-12 py-6 rounded-2xl hover:bg-green-400 transition-all shadow-[0_0_40px_rgb(34,197,94,0.4)] hover:shadow-[0_0_60px_rgb(34,197,94,0.6)] hover:scale-105 transform flex items-center justify-center gap-2">
										{data.ctaText || "Gerar Meu Recurso Agora"}
									</Link>
									<p className="text-sm text-gray-400 flex items-center justify-center gap-1">
										<ShieldCheck size={16} /> Processo 100% seguro e sigiloso
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</CleanLayout>
	);
};

export default AdsLandingPage;
