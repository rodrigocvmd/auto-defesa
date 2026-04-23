import React from "react";
import { useParams, Link } from "react-router-dom";
import CleanLayout from "../layouts/CleanLayout";
import SEO from "../components/SEO";
import { infractionData } from "../utils/infractionData";
import { CheckCircle, ArrowRight, ShieldCheck, Zap, Clock } from "lucide-react";

const AdsLandingPage = () => {
	const { slug } = useParams();
	const data = infractionData[slug];

	if (!data) {
		return (
			<CleanLayout>
				<div className="text-center py-20">
					<h1 className="text-2xl font-bold text-gray-800">Página não encontrada</h1>
					<Link to="/" className="text-blue-600 mt-4 inline-block underline">
						Voltar para o início
					</Link>
				</div>
			</CleanLayout>
		);
	}

	const aggressiveTitle = `Recurso de Multa ${data.title.replace("Recurso de Multa ", "").replace("Multa ", "")} - Rápido e Profissional`;

	return (
		<CleanLayout>
			<SEO
				title={aggressiveTitle}
				description={`Evite a suspensão da sua CNH! Defesa especializada para ${data.title}. Tecnologia de IA para identificar falhas técnicas e anular sua multa.`}
				keywords={`recurso multa, ${slug}, defesa cnh, anular multa`}
			/>

			<div className="space-y-10">
				{/* Hero Section */}
				<section className="text-center space-y-6 pt-4">
					<div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold animate-pulse">
						<Zap size={16} /> Oportunidade: Recurso Gerado por IA Pro
					</div>
					<h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
						{data.title}
					</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
						{data.description}
					</p>
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
						<Link
							to="/upload"
							className="w-full sm:w-auto bg-blue-600 text-white text-xl font-bold px-10 py-5 rounded-2xl shadow-2xl hover:bg-blue-700 hover:scale-105 transition-all flex items-center justify-center gap-2">
							Começar Recurso Agora <ArrowRight size={24} />
						</Link>
						<p className="text-sm text-gray-500 flex items-center gap-1">
							<Clock size={16} /> Leva menos de 2 minutos
						</p>
					</div>
				</section>

				{/* Trust Badges */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-10 border-y border-gray-100">
					<div className="flex flex-col items-center text-center p-4">
						<div className="bg-green-100 p-3 rounded-2xl text-green-600 mb-4">
							<ShieldCheck size={32} />
						</div>
						<h3 className="font-bold text-gray-900 mb-1">100% Dentro da Lei</h3>
						<p className="text-sm text-gray-500">
							Argumentação baseada no CTB e resoluções do CONTRAN.
						</p>
					</div>
					<div className="flex flex-col items-center text-center p-4">
						<div className="bg-blue-100 p-3 rounded-2xl text-blue-600 mb-4">
							<Zap size={32} />
						</div>
						<h3 className="font-bold text-gray-900 mb-1">IA Especializada</h3>
						<p className="text-sm text-gray-500">
							Tecnologia exclusiva treinada para identificar erros de fiscalização.
						</p>
					</div>
					<div className="flex flex-col items-center text-center p-4">
						<div className="bg-yellow-100 p-3 rounded-2xl text-yellow-600 mb-4">
							<CheckCircle size={32} />
						</div>
						<h3 className="font-bold text-gray-900 mb-1">Resultado Imediato</h3>
						<p className="text-sm text-gray-500">
							O seu recurso fica pronto para imprimir e protocolar na hora.
						</p>
					</div>
				</div>

				{/* FAQ Section */}
				<section className="space-y-6">
					<h2 className="text-2xl font-bold text-gray-900 text-center">Dúvidas Frequentes</h2>
					<div className="grid gap-4">
						{data.faq.map((item, idx) => (
							<div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
								<h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
									<div className="w-2 h-2 bg-blue-600 rounded-full"></div>
									{item.q}
								</h4>
								<p className="text-gray-600 text-sm leading-relaxed pl-4">{item.a}</p>
							</div>
						))}
					</div>
				</section>

				{/* Final CTA */}
				<section className="bg-gray-900 rounded-3xl p-8 md:p-12 text-center text-white space-y-6 shadow-2xl overflow-hidden relative">
					<div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-3xl rounded-full -mr-32 -mt-32"></div>
					<h2 className="text-3xl font-black leading-tight">
						Não pague essa multa sem antes recorrer!
					</h2>
					<p className="text-gray-400 text-lg max-w-xl mx-auto">
						Milhares de multas são anuladas todos os anos por erros técnicos que só uma análise
						profissional identifica.
					</p>
					<div className="pt-4">
						<Link
							to="/upload"
							className="inline-flex bg-white text-gray-900 text-lg font-black px-12 py-5 rounded-2xl hover:bg-gray-100 transition-all shadow-xl">
							Gerar Meu Recurso Agora
						</Link>
					</div>
				</section>
			</div>
		</CleanLayout>
	);
};

export default AdsLandingPage;
