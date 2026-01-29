import React from "react";
import { Link } from "react-router-dom";
import {
	Upload,
	FileText,
	ArrowRight,
	CheckCircle,
	Shield,
	Clock,
	DollarSign,
	FileCheck,
	Star,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import SEO from "../components/SEO";

const Home = () => {
	return (
		<MainLayout>
			<SEO
				title="Recorra de Multas com IA | Advogado Virtual"
				description="Anule sua multa de trânsito em minutos com Inteligência Artificial. Defesa prévia, JARI e CETRAN. Recurso personalizado e pronto para imprimir."
				keywords="recurso de multa, multa de transito, recorrer multa, inteligencia artificial, advogado transito online, anular multa"
			/>
			<div className="flex flex-col gap-20 pb-20">
				{/* HERO SECTION */}
				<section className="relative pt-8 pb-4 lg:pt-10 lg:pb-10 overflow-hidden">
					<div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-gray-50 to-white"></div>

					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
							<Star size={14} fill="currentColor" /> Tecnologia Avançada de Recursos
						</div>

						<h1 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tight mb-6 leading-tight max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
							Anule sua Multa de Trânsito com{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
								Inteligência Artificial
							</span>
						</h1>

						<p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
							Não gaste R$ 400,00 com advogados. Nossa IA analisa seu caso gratuitamente e gera um{" "}
							<strong>recurso administrativo profissional</strong>, fundamentado na lei, completo e{" "}
							<strong>pronto para assinatura e protocolo</strong>.
						</p>

						<div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
							<Link
								to="/upload"
								className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2">
								<Upload size={24} />
								Analisar Multa Grátis
							</Link>
						</div>

						<div className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-gray-500 animate-in fade-in duration-1000 delay-500">
							<div className="flex items-center gap-2">
								<CheckCircle size={16} className="text-green-500" /> Baseado no CTB e Normativas
								CONTRAN
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle size={16} className="text-green-500" /> Análise de Viabilidade Imediata
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle size={16} className="text-green-500" /> Documento em PDF Pronto para
								Protocolo
							</div>
						</div>
					</div>
				</section>

				{/* COMO FUNCIONA */}
				<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-black text-gray-900 mb-4">Como funciona?</h2>
						<p className="text-gray-600 max-w-3xl mx-auto">
							Simplificamos a burocracia. Em poucos minutos você terá em mãos a defesa perfeita para
							o seu caso.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden">
							<div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-50 rounded-full opacity-50 blur-2xl"></div>
							<div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 font-bold text-2xl">
								1
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-3">Envie a Notificação</h3>
							<p className="text-gray-500 leading-relaxed">
								Envie o arquivo ou foto da multa ou ainda digite os dados manualmente. Nossa{" "}
								<strong>tecnologia OCR</strong> lê as informações instantaneamente.
							</p>
						</div>

						<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden">
							<div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-50 rounded-full opacity-50 blur-2xl"></div>
							<div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 font-bold text-2xl">
								2
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-3">IA Analisa o Caso</h3>
							<p className="text-gray-500 leading-relaxed">
								O algoritmo verifica <strong>erros formais e materiais</strong> e busca as melhores
								teses jurídicas na legislação para anular sua infração.
							</p>
						</div>

						<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden">
							<div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-50 rounded-full opacity-50 blur-2xl"></div>
							<div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6 font-bold text-2xl">
								3
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-3">Baixe e Protocole</h3>
							<p className="text-gray-500 leading-relaxed">
								Receba o <strong>documento completo em PDF</strong>. Basta imprimir ou assinar
								digitalmente e enviar ou protocolar junto ao órgão autuador.
							</p>
						</div>
					</div>
				</section>

				{/* VALOR / COMPARATIVO */}
				<section className="bg-gray-900 rounded-[3rem] py-20 mx-4 sm:mx-8 text-white relative overflow-hidden">
					<div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
						<div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500 rounded-full blur-[100px]"></div>
						<div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[100px]"></div>
					</div>

					<div className="max-w-6xl mx-auto px-6 lg:px-16 relative z-10">
						<div className="text-center mb-16">
							<h2 className="text-3xl md:text-4xl font-black mb-6">
								Por que escolher a AutoDefesa?
							</h2>
							<p className="text-gray-400 max-w-3xl mx-auto text-lg">
								Democratizamos o acesso à defesa de trânsito de qualidade. Compare e veja a
								diferença:
							</p>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
							{/* Card Lawyer */}
							<div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/10">
								<h3 className="text-xl font-bold text-gray-300 mb-6 flex items-center gap-2">
									<Shield size={20} /> Defesa Tradicional (Advogado)
								</h3>
								<ul className="space-y-4 text-gray-400">
									<li className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-1 sm:gap-0">
										<span>Custo Médio</span>
										<span className="font-bold text-white">R$ 350,00 - R$ 800,00</span>
									</li>
									<li className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-1 sm:gap-0">
										<span>Tempo de Espera</span>
										<span className="font-bold text-white">3 a 5 dias úteis</span>
									</li>
									<li className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
										<span>Processo</span>
										<span className="font-bold text-white">Burocrático e lento</span>
									</li>
								</ul>
							</div>

							{/* Card AutoDefesa */}
							<div className="bg-white text-gray-900 rounded-3xl p-6 sm:p-8 border-4 border-blue-500 shadow-2xl relative transform lg:scale-110">
								<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg whitespace-nowrap">
									MELHOR ESCOLHA
								</div>
								<h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
									<span className="text-blue-600">AutoDefesa</span> IA
								</h3>
								<ul className="space-y-4">
									<li className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-1 sm:gap-0">
										<span className="font-medium text-gray-600">Custo</span>
										<span className="font-black text-green-600 text-xl sm:text-2xl">
											Apenas R$ 16,90
										</span>
									</li>
									<li className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-1 sm:gap-0">
										<span className="font-medium text-gray-600">Tempo de Espera</span>
										<span className="font-bold text-blue-600 flex items-center gap-1">
											<Clock size={16} /> Imediato
										</span>
									</li>
									<li className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-1 sm:gap-0">
										<span className="font-medium text-gray-600">Qualidade</span>
										<span className="font-bold text-gray-900">IA Especializada em Recursos</span>
									</li>
									<li className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
										<span className="font-medium text-gray-600">Resultado</span>
										<span className="font-bold text-gray-900 flex items-center gap-1">
											<FileCheck size={18} className="text-blue-600" /> Pronto para Protocolar
										</span>
									</li>
								</ul>
								<Link
									to="/upload"
									className="mt-8 w-full block bg-gray-900 hover:bg-gray-800 text-white text-center font-bold py-4 rounded-xl transition-all">
									Analisar um Recurso gratuitamente agora
								</Link>
							</div>
						</div>
					</div>
				</section>

				{/* FAQ SIMPLIFICADO */}
				<section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-black text-gray-900 mb-4">Dúvidas Frequentes</h2>
					</div>

					<div className="grid gap-6">
						<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
							<h3 className="font-bold text-lg text-gray-900 mb-2">
								O documento serve para qualquer estado?
							</h3>
							<p className="text-gray-600">
								Sim. A legislação de trânsito (CTB) é federal. Nossa IA gera o recurso endereçado
								corretamente para o órgão autuador de qualquer estado do Brasil.
							</p>
						</div>
						<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
							<h3 className="font-bold text-lg text-gray-900 mb-2">
								Preciso contratar advogado depois?
							</h3>
							<p className="text-gray-600">
								Não. O recurso administrativo não exige advogado em nenhuma etapa. O documento que
								geramos já vem com a fundamentação legal e técnica necessária. É só assinar e
								entregar.
							</p>
						</div>
						<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
							<h3 className="font-bold text-lg text-gray-900 mb-2">
								E se eu não souber o artigo da infração?
							</h3>
							<p className="text-gray-600">
								Fique tranquilo. Ao fazer o upload da notificação, nossa IA identifica
								automaticamente o artigo e materialidade da infração e os detalhes para montar a
								melhor defesa possível.
							</p>
						</div>
					</div>
				</section>

				{/* CTA FINAL */}
				<div className="text-center px-4">
					<div className="inline-block p-1 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-2xl">
						<div className="bg-white rounded-[1.3rem] px-8 py-12 md:px-16 md:py-16 max-w-4xl">
							<h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
								Não deixe os pontos vencerem
							</h2>
							<p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
								Teste agora mesmo. A análise inicial de viabilidade é <strong>100% gratuita</strong>
								.
							</p>
							<Link
								to="/upload"
								className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white font-bold text-xl py-4 px-10 rounded-xl hover:bg-gray-800 transition-all hover:scale-105 shadow-lg">
								Iniciar Defesa Gratuita <ArrowRight size={20} />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default Home;
