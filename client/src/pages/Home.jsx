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
	StarHalf,
	ChevronDown,
	ChevronRight,
	Scale,
	AlertTriangle,
	Zap,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import SEO from "../components/SEO";
import Testimonials from "../components/Testimonials";
import ScrollReveal from "../components/ScrollReveal";

const Home = () => {
	return (
		<MainLayout>
			<SEO
				title="Recorra de Multas com IA | Recurso Pronto para protocolar em minutos | Apenas R$ 17,90"
				description="Gere seu Recurso de Multa de trânsito em minutos com Inteligência Artificial. Defesa prévia, JARI e CETRAN. Recurso personalizado e pronto para imprimir."
				keywords="recurso de multa, multa de transito, recorrer multa, inteligencia artificial, advogado transito online"
				isHome={true}
			/>
			<div className="flex flex-col pb-8">
				{/* HERO SECTION */}
				<section className="relative pt-1 mb-6 md:mb-0 overflow-hidden flex flex-col justify-center">
					<div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/70 via-gray-50 to-white"></div>
					{/* Elementos decorativos de fundo */}
					<div className="absolute top-20 left-[-5%] w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse duration-[8000ms]"></div>
					<div className="absolute bottom-20 right-[-5%] w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse duration-[10000ms]"></div>

					<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 mt-3">
						<div className="grid lg:grid-cols-12 gap-10 lg:gap-20 items-center md:mt-4 !pb-5 md:!pb-0">
							{/* Texto Hero */}
							<div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start pt-3 lg:pt-0">
								<h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 !text-center !w-full">
									Elabore um{" "}
									<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-300% animate-gradient">
										Recurso
									</span>{" "}
									e cancele sua multa com <br className="hidden lg:block" />
									<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-300% animate-gradient">
										Inteligência Artificial
									</span>
								</h1>

								<p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 !text-center mx-4">
									Não perca mais dinheiro ou pontos na sua CNH. Em <strong>2 minutos</strong>, nossa
									IA encontra <strong>falhas reais</strong> e <strong>argumentos viáveis</strong> na
									sua autuação para elaborar uma <strong>Defesa Técnica Profissional</strong>{" "}
									totalmente pronta. Você apenas <strong>assina e protocola</strong>.
								</p>

								{/* Benefícios - Narrativa Estilizada */}
								<div>
									{/* <div className="relative py-5 px-6 bg-gradient-to-r from-blue-50/50 via-white/50 to-indigo-50/50 rounded-[2rem] border border-blue-100/30 shadow-sm">
										<p className="text-gray-600 font-medium leading-relaxed text-sm md:text-base">
											<span className="text-blue-600 font-black inline-flex items-center gap-1">
												<Zap size={18} /> Em 2 minutos
											</span>
											, sua{" "}
											<span className="text-indigo-600 font-black inline-flex items-center gap-1">
												<CheckCircle size={18} /> Análise Gratuita
											</span>{" "}
											se torna um{" "}
											<span className="text-blue-700 font-black inline-flex items-center gap-1">
												<FileCheck size={18} /> Recurso Pronto
											</span>{" "}
											totalmente baseado no{" "}
											<span className="text-indigo-700 font-black inline-flex items-center gap-1">
												<Shield size={18} /> CTB Atualizado
											</span>
											.
										</p>
									</div> */}
								</div>

								<div className="flex flex-col items-center lg:items-center w-full gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
									<Link
										to="/upload"
										className="group relative w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-lg font-black py-4 px-6 rounded-2xl shadow-[0_8px_30px_rgb(37,99,235,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_15px_40px_rgb(37,99,235,0.4)] active:translate-y-0 flex items-center justify-center gap-3 overflow-hidden">
										{/* Shimmer Effect */}
										<div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full h-full animate-shimmer"></div>
										<div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
										<Upload
											size={24}
											className="hidden md:block relative z-10 group-hover:-translate-y-1 transition-transform"
										/>
										<span className="relative z-10">Analisar Multa Gratuitamente</span>
									</Link>

									<div className="flex items-center justify-center gap-6 sm:gap-12 text-gray-500 font-medium w-full mt-4 !mx-20">
										<div className="flex flex-col items-center gap-1">
											<div className="flex items-center gap-0.5 text-yellow-400 mb-1">
												<Star size={16} fill="currentColor" />
												<Star size={16} fill="currentColor" />
												<Star size={16} fill="currentColor" />
												<Star size={16} fill="currentColor" />
												<StarHalf size={16} fill="currentColor" />
											</div>
											<span className="text-[13px] md:text-md uppercase tracking-wider font-bold text-gray-400">
												4.7 <br />
												avaliação geral
											</span>
										</div>

										<div className="flex flex-col items-center gap-1">
											<div className="flex items-center -space-x-1 mb-1 text-blue-600">
												<FileText size={18} className="drop-shadow-sm" />
												<FileText size={18} className="drop-shadow-sm translate-y-0.5" />
												<FileText size={18} className="drop-shadow-sm translate-y-1" />
											</div>
											<span className="text-[13px] sm:text-xs uppercase tracking-wider font-bold text-gray-400">
												+500
												<br />
												recursos gerados
											</span>
										</div>
									</div>
								</div>
							</div>

							{/* Imagem Hero */}
							<div className="hidden md:block lg:col-span-5 relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-400 mt-4 lg:mt-0 w-full max-w-[300px] sm:max-w-sm mx-auto lg:max-w-none justify-center lg:justify-end">
								{/* Soft backdrop for blending */}
								<div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-indigo-400 rounded-full opacity-20 blur-[80px] -z-10 transform scale-110"></div>

								<div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl transition-transform hover:scale-[1.02] duration-500 hidden lg:block">
									<img
										src="/imagemLanding.webp"
										srcSet="/imagemLanding-SM.webp 600w, /imagemLanding.webp 1200w"
										sizes="(max-width: 768px) 100vw, 50vw"
										width="1200"
										height="1600"
										alt="Motorista segurando celular com recurso procedente"
										className="w-full h-auto object-cover max-h-[500px] lg:max-h-[600px] rounded-[2.5rem] mix-blend-multiply"
										fetchpriority="high"
									/>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* COMO FUNCIONA */}
				<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<ScrollReveal>
						<div className="text-center mb-7">
							<h2 className="text-3xl font-black text-gray-900 mt-2 mb-4 lg:mt-10">
								Como funciona?
							</h2>
							<p className="text-gray-600 max-w-3xl mx-auto text-lg lg:text-xl">
								Simplificamos a burocracia. Em poucos minutos você terá em mãos a defesa perfeita
								para o seu caso.
							</p>
						</div>
					</ScrollReveal>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<ScrollReveal delay={100}>
							<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden h-full">
								<div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-50 rounded-full opacity-50 blur-2xl"></div>
								<div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 font-bold text-2xl">
									1
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-3">Envie a Notificação</h3>
								<p className="text-gray-600 leading-relaxed">
									Envie o arquivo ou foto da multa ou ainda digite os dados manualmente. Nossa{" "}
									<strong>tecnologia OCR</strong> lê as informações instantaneamente.
								</p>
							</div>
						</ScrollReveal>

						<ScrollReveal delay={200}>
							<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden h-full">
								<div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-50 rounded-full opacity-50 blur-2xl"></div>
								<div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 font-bold text-2xl">
									2
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-3">IA Analisa o Caso</h3>
								<p className="text-gray-600 leading-relaxed">
									O algoritmo verifica <strong>erros formais e materiais</strong> e busca as
									melhores teses jurídicas na legislação para anular sua infração.
								</p>
							</div>
						</ScrollReveal>

						<ScrollReveal delay={300}>
							<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden h-full">
								<div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-50 rounded-full opacity-50 blur-2xl"></div>
								<div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6 font-bold text-2xl">
									3
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-3">Baixe e Protocole</h3>
								<p className="text-gray-600 leading-relaxed">
									Receba o <strong>documento completo em PDF</strong>. Basta imprimir ou assinar
									digitalmente e enviar ou protocolar junto ao órgão autuador.
								</p>
							</div>
						</ScrollReveal>
					</div>
				</section>

				{/* VALOR / COMPARATIVO */}
				<section className="bg-gray-900 rounded-[3rem] py-20 mx-4 sm:mx-8 text-white relative overflow-hidden mt-5 lg:mt-16">
					<div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
						<div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500 rounded-full blur-[100px]"></div>
						<div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[100px]"></div>
					</div>

					<div className="max-w-6xl mx-auto px-6 lg:px-16 relative z-10">
						<ScrollReveal>
							<div className="text-center mb-16">
								<h2 className="text-3xl md:text-4xl font-black mb-6">
									Por que escolher o AutoDefesa?
								</h2>
								<p className="text-gray-300 max-w-3xl mx-auto text-lg">
									Democratizamos o acesso à defesa de trânsito de qualidade. Compare e veja a
									diferença:
								</p>
							</div>
						</ScrollReveal>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
							{/* Card Lawyer */}
							<ScrollReveal direction="left">
								<div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/10">
									<h3 className="text-xl font-bold text-gray-300 mb-6 flex items-center gap-2">
										<Shield size={20} /> Defesa Tradicional (Advogado)
									</h3>
									<ul className="space-y-4 text-gray-300">
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
							</ScrollReveal>

							{/* Card AutoDefesa */}
							<ScrollReveal direction="right">
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
												Apenas R$ 17,90
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
							</ScrollReveal>
						</div>
					</div>
				</section>

				{/* FAQ SIMPLIFICADO */}
				<section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 lg:mt-5">
					<ScrollReveal>
						<div className="text-center mb-7">
							<h2 className="text-3xl font-black text-gray-900 mt-12">Dúvidas Frequentes</h2>
						</div>
					</ScrollReveal>

					<div className="grid gap-6">
						<ScrollReveal delay={100}>
							<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
								<h3 className="font-bold text-lg text-gray-900 mb-2">
									O documento serve para qualquer estado?
								</h3>
								<p className="text-gray-600">
									Sim. A legislação de trânsito (CTB) é federal. Nossa IA gera o recurso endereçado
									corretamente para o órgão autuador de qualquer estado do Brasil.
								</p>
							</div>
						</ScrollReveal>
						<ScrollReveal delay={150}>
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
						</ScrollReveal>
						<ScrollReveal delay={200}>
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
						</ScrollReveal>
						<ScrollReveal delay={250}>
							<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
								<h3 className="font-bold text-lg text-gray-900 mb-2">
									O recurso é personalizado para o meu caso?
								</h3>
								<p className="text-gray-600">
									Sim. Diferente de modelos prontos da internet, nossa IA analisa os dados
									específicos do seu auto de infração (horário, local, aferição do equipamento) para
									encontrar nulidades reais que anulam a sua multa.
								</p>
							</div>
						</ScrollReveal>
						<ScrollReveal delay={300}>
							<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
								<h3 className="font-bold text-lg text-gray-900 mb-2">
									Quanto tempo demora para receber o recurso?
								</h3>
								<p className="text-gray-600">
									O processo é instantâneo. Após a análise da IA, seu recurso em PDF é gerado em
									menos de 2 minutos, pronto para você imprimir, assinar e protocolar.
								</p>
							</div>
						</ScrollReveal>
					</div>
				</section>

				{/* PROPOSTA DE VALOR / DIFERENCIAIS */}
				<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<ScrollReveal>
						<div className="text-center mb-16">
							<span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4 inline-block">
								Por que confiar no Auto Defesa?
							</span>
							<h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">
								Defesa Técnica com Inteligência Jurídica
							</h2>
							<p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
								Utilizamos tecnologia de ponta para analisar sua multa, identificando falhas
								administrativas e garantindo o seu pleno direito de defesa.
							</p>
						</div>
					</ScrollReveal>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{/* Card 1 */}
						<ScrollReveal delay={50}>
							<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all h-full">
								<div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
									<Shield size={24} />
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-3">Rigor Legislativo</h3>
								<p className="text-gray-600">
									Nossa base de conhecimento é atualizada em tempo real com o CTB, resoluções do
									CONTRAN e o Manual Brasileiro de Fiscalização de Trânsito.
								</p>
							</div>
						</ScrollReveal>

						{/* Card 2 */}
						<ScrollReveal delay={100}>
							<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all h-full">
								<div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
									<Scale size={24} />
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-3">Foco em Nulidades</h3>
								<p className="text-gray-600">
									Buscamos erros de procedimento e vícios formais que, por lei, tornam o auto de
									infração insubsistente e passível de anulação.
								</p>
							</div>
						</ScrollReveal>

						{/* Card 3 */}
						<ScrollReveal delay={150}>
							<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all h-full">
								<div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6">
									<FileCheck size={24} />
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-3">Recurso Pronto para Uso</h3>
								<p className="text-gray-600">
									Ao detectar uma falha, geramos automaticamente o recurso administrativo em PDF,
									fundamentado e pronto para ser protocolado.
								</p>
							</div>
						</ScrollReveal>

						{/* Card 4 */}
						<ScrollReveal delay={200}>
							<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all h-full">
								<div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600 mb-6">
									<AlertTriangle size={24} />
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-3">Honestidade Jurídica</h3>
								<p className="text-gray-600">
									Não prometemos milagres. Oferecemos uma análise técnica real para que você saiba
									exatamente quais são as suas chances de sucesso.
								</p>
							</div>
						</ScrollReveal>

						{/* Card 5 */}
						<ScrollReveal delay={250}>
							<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all h-full">
								<div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
									<Clock size={24} />
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-3">Resposta Instantânea</h3>
								<p className="text-gray-600">
									Em poucos segundos, nossa IA processa os dados e indica se vale a pena investir
									tempo e esforço no seu recurso de multa.
								</p>
							</div>
						</ScrollReveal>

						{/* Card 6 */}
						<ScrollReveal delay={300}>
							<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all h-full">
								<div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
									<Zap size={24} />
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-3">Tecnologia de Ponta</h3>
								<p className="text-gray-600">
									Utilizamos OCR e visão computacional para ler sua multa automaticamente,
									eliminando erros de digitação e agilizando o processo.
								</p>
							</div>
						</ScrollReveal>
					</div>
				</section>

				{/* NÚMEROS POSITIVOS */}
				<section className="relative overflow-hidden">
					<div className="absolute inset-0 -z-10 bg-gray-50/50"></div>
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent"></div>

					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 pb-8 md:pb-0 snap-x snap-mandatory no-scrollbar">
							<ScrollReveal delay={0} className="flex-none w-[280px] md:w-auto">
								<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-transform duration-300 group snap-start transform-gpu will-change-transform h-full">
									<div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform transform-gpu">
										<FileText size={24} />
									</div>
									<div className="text-gray-900 text-4xl font-black mb-2 tracking-tight">+493</div>
									<div className="text-gray-600 font-medium">Recursos Elaborados</div>
									<div className="mt-4 h-1 w-12 bg-blue-600 rounded-full"></div>
								</div>
							</ScrollReveal>

							<ScrollReveal delay={100} className="flex-none w-[280px] md:w-auto">
								<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-transform duration-300 group snap-start transform-gpu will-change-transform h-full">
									<div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform transform-gpu">
										<DollarSign size={24} />
									</div>
									<div className="text-gray-900 text-4xl font-black mb-2 tracking-tight">
										R$ 293
									</div>
									<div className="text-gray-600 font-medium">Economia Média p/ Usuário</div>
									<div className="mt-4 h-1 w-12 bg-green-600 rounded-full"></div>
								</div>
							</ScrollReveal>

							<ScrollReveal delay={200} className="flex-none w-[280px] md:w-auto">
								<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-transform duration-300 group snap-start transform-gpu will-change-transform h-full">
									<div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center text-yellow-600 mb-6 group-hover:scale-110 transition-transform transform-gpu">
										<Star size={24} fill="currentColor" />
									</div>
									<div className="text-gray-900 text-4xl font-black mb-2 tracking-tight">93%</div>
									<div className="text-gray-600 font-medium">Satisfação dos Usuários</div>
									<div className="mt-4 h-1 w-12 bg-yellow-500 rounded-full"></div>
								</div>
							</ScrollReveal>

							<ScrollReveal delay={300} className="flex-none w-[280px] md:w-auto">
								<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-transform duration-300 group snap-start transform-gpu will-change-transform h-full">
									<div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform transform-gpu">
										<Clock size={24} />
									</div>
									<div className="text-gray-900 text-4xl font-black mb-2 tracking-tight">
										&lt; 3min
									</div>
									<div className="text-gray-600 font-medium">Tempo Médio de Geração</div>
									<div className="mt-4 h-1 w-12 bg-indigo-600 rounded-full"></div>
								</div>
							</ScrollReveal>
						</div>

						{/* Hint for mobile */}
						<div className="text-center mt-2 text-gray-600 text-sm animate-pulse md:hidden">
							Arraste para o lado e veja mais <ChevronRight size={14} className="inline" />
						</div>
					</div>
				</section>

				{/* AVALIAÇÕES */}
				<ScrollReveal>
					<Testimonials />
				</ScrollReveal>

				{/* CTA FINAL */}
				<ScrollReveal>
					<div className="text-center px-4">
						<div className="inline-block p-1 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-2xl">
							<div className="bg-white rounded-[1.3rem] px-8 py-12 md:px-16 md:py-16 max-w-4xl">
								<h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
									Não deixe os pontos vencerem
								</h2>
								<p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
									Teste agora mesmo. A análise inicial de viabilidade é{" "}
									<strong>100% gratuita</strong>.
								</p>
								<Link
									to="/upload"
									className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white font-bold text-xl py-4 px-10 rounded-xl hover:bg-gray-800 transition-all hover:scale-105 shadow-lg">
									Iniciar Defesa Gratuita <ArrowRight size={20} />
								</Link>
							</div>
						</div>
					</div>
				</ScrollReveal>
			</div>
		</MainLayout>
	);
};

export default Home;
