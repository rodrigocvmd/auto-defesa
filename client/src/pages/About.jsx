import React from "react";
import MainLayout from "../layouts/MainLayout";
import SEO from "../components/SEO";
import {
	ShieldCheck,
	History,
	Cpu,
	CheckCircle,
	Target,
	ArrowRight,
	Zap,
	Scale,
	Users,
	ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
	// AboutPage Schema for Google E-E-A-T
	const aboutSchema = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		mainEntity: {
			"@type": "Organization",
			name: "Auto Defesa",
			description:
				"Tecnologia jurídica avançada para democratizar o direito de defesa dos motoristas brasileiros.",
			founder: {
				"@type": "Person",
				name: "Rodrigo Carvalho",
				jobTitle: "Fundador e Especialista Jurídico",
				knowsAbout: ["Direito de Trânsito", "CTB", "Inteligência Artificial"],
			},
		},
	};

	return (
		<MainLayout>
			<SEO
				title="Sobre Nós"
				description="Conheça o Auto Defesa: Unimos inteligência artificial e expertise jurídica para proteger o direito de dirigir de milhares de brasileiros."
			/>
			<script type="application/ld+json">{JSON.stringify(aboutSchema)}</script>

			{/* 1. Hero Section */}
			<section className="bg-blue-50 border-b border-blue-100 overflow-hidden">
				<div className="max-w-7xl mx-auto px-4 py-12 md:py-12 relative">
					<div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl"></div>
					<div className="max-w-3xl relative z-10">
						<div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-blue-200">
							<ShieldCheck size={18} /> Tecnologia e Direito
						</div>
						<h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] mb-6">
							Mais do que tecnologia, sua <span className="text-blue-600">defesa técnica</span> no
							trânsito.
						</h1>
						<p className="text-xl text-gray-600 leading-relaxed font-medium max-w-2xl">
							Combinamos inteligência artificial avançada com conhecimento jurídico especializado
							para democratizar o direito de defesa dos motoristas brasileiros.
						</p>
					</div>
				</div>
			</section>

			{/* 2. Nossa História (Storytelling) */}
			<section className="py-20 bg-white">
				<div className="max-w-7xl mx-auto px-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
						<div className="order-2 lg:order-1">
							<div className="inline-flex items-center gap-2 text-blue-600 font-bold mb-4 uppercase tracking-wider text-sm">
								<History size={20} /> Nossa História
							</div>
							<h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
								O Direito de Defesa não deveria ser burocrático
							</h2>
							<div className="space-y-6 text-lg text-gray-600 leading-relaxed">
								<p>
									O Auto Defesa nasceu de uma frustração comum: a complexidade desnecessária do
									sistema de trânsito brasileiro. Percebemos que milhares de motoristas aceitavam
									multas injustas ou perdiam suas carteiras de habilitação não porque eram culpados,
									mas porque não sabiam como se defender tecnicamente ou não podiam arcar com os
									custos de um escritório de advocacia tradicional.
								</p>
								<p>
									Entendemos que o Código de Trânsito Brasileiro (CTB) é técnico e rigoroso, e que a
									defesa do condutor também precisa ser. Foi assim que decidimos unir o rigor da lei
									com a velocidade da tecnologia. Criamos um sistema capaz de analisar infrações em
									segundos, identificar erros formais e gerar defesas personalizadas com embasamento
									jurídico sólido.
								</p>
							</div>
						</div>
						<div className="order-1 lg:order-2">
							<div className="bg-blue-50 rounded-[2.5rem] p-12 border border-blue-100 relative">
								<div className="absolute -top-4 -left-4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
									<Scale size={40} className="text-blue-600" />
								</div>
								<blockquote className="text-2xl font-bold text-blue-900 italic leading-relaxed">
									"O CTB existe para organizar o trânsito, mas o devido processo legal existe para
									proteger o cidadão contra arbitrariedades."
								</blockquote>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* 3. Como Funciona Nossa Tecnologia */}
			<section className="pt-16 pb-12 bg-gray-50 border-y border-gray-100">
				<div className="max-w-7xl mx-auto px-4">
					<div className="text-center max-w-3xl mx-auto mb-16">
						<div className="inline-flex items-center gap-2 text-blue-600 font-bold mb-4 uppercase tracking-wider text-sm">
							<Cpu size={20} /> Inovação
						</div>
						<h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">
							Inteligência Artificial treinada na Legislação de Trânsito
						</h2>
						<p className="text-lg text-gray-600">
							Diferente de modelos genéricos, o "cérebro" do Auto Defesa foi treinado
							especificamente com as normas do CONTRAN, resoluções atualizadas e o Código de
							Trânsito Brasileiro.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{/* Card 1 */}
						<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
							<div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
								<Zap size={28} />
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-4">Análise de Erros Formais</h3>
							<p className="text-gray-600 leading-relaxed">
								Nossa IA verifica se o Auto de Infração preenche todos os requisitos legais, como
								aferição do radar, preenchimento correto de campos e prazos de notificação.
							</p>
						</div>

						{/* Card 2 */}
						<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
							<div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
								<Users size={28} />
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-4">Argumentação Personalizada</h3>
							<p className="text-gray-600 leading-relaxed">
								Não usamos modelos prontos (copia e cola) onde você apenas preenche os campos. Cada
								recurso é redigido considerando as especificidades do seu caso.
							</p>
						</div>

						{/* Card 3 */}
						<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
							<div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
								<History size={28} />
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-4">Atualização Constante</h3>
							<p className="text-gray-600 leading-relaxed">
								O sistema é atualizado em tempo real sempre que uma nova lei de trânsito, resolução
								do CONTRAN ou portaria do SENATRAN entra em vigor.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* 4. Quem Faz Acontecer (Foco em E-E-A-T) */}
			<section className="pt-16 pb-12 bg-white overflow-hidden">
				<div className="max-w-7xl mx-auto px-4">
					<div className="bg-blue-900 rounded-[3rem] overflow-hidden shadow-2xl relative">
						{/* Abstract Background Decoration */}
						<div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-800 rounded-full blur-3xl -mb-20 -mr-20 opacity-50"></div>

						<div className="flex flex-col lg:flex-row items-stretch">
							<div className="lg:w-2/5 relative bg-blue-800/50 border-b lg:border-b-0 lg:border-r border-blue-800/30">
								{/* Founder Photo & Quick Info */}
								<div className="flex flex-col items-center justify-center p-8 md:p-12 text-center h-full">
									<div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-blue-700/50 border-4 border-blue-600/30 flex items-center justify-center mb-6 overflow-hidden shadow-2xl">
										<img
											src="/perfil.webp"
											alt="Rodrigo Carvalho - Fundador Auto Defesa"
											className="w-full h-full object-cover"
										/>
									</div>
									<div className="space-y-2">
										<h4 className="text-3xl font-black text-white">Rodrigo Carvalho</h4>
										<p className="text-blue-300 font-medium text-xl">Desenvolvedor Responsável</p>
										<p className="text-blue-400 text-md italic">
											Bacharel em Direito e Ciência da Computação
										</p>
									</div>
									<div className="mt-8 md:mt-12 flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 max-w-sm mx-auto text-left">
										<CheckCircle className="text-blue-400 shrink-0" size={20} />
										<span className="text-white font-medium text-left text-sm leading-tight">
											Dedicado a facilitar análise da legislação de trânsito e possibilitar a defesa
											administrativa absoluta do usuário.
										</span>
									</div>
								</div>
							</div>
							<div className="lg:w-3/5 p-8 md:p-20 flex flex-col justify-center relative z-10">
								<div className="inline-flex items-center gap-2 text-blue-400 font-bold mb-4 uppercase tracking-wider text-sm">
									Liderança com DNA Jurídico
								</div>
								<h2 className="text-2xl md:text-3xl font-black text-white mb-8">
									Por trás dos algoritmos, existe supervisão humana especializada.
								</h2>
								<div className="space-y-6 text-xl text-blue-100 leading-relaxed italic">
									<p>
										"Minha missão como fundador é garantir que a tecnologia sirva como uma ponte
										para a justiça. Ninguém deve ser penalizado por uma infração indevida, que
										contém vícios técnicos ou erros de procedimento."
									</p>
									<p className="not-italic text-blue-400 font-black text-xl">— Rodrigo Carvalho</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* 5. Nossa Missão e Compromisso */}
			<section className="pt-16 pb-12 bg-white">
				<div className="max-w-7xl mx-auto px-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
						<div>
							<div className="inline-flex items-center gap-2 text-blue-600 font-bold mb-4 uppercase tracking-wider text-sm">
								<Target size={20} /> Nosso Compromisso
							</div>
							<h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
								Transparência e Resultado
							</h2>
							<p className="text-lg text-gray-600 leading-relaxed mb-8">
								Não vendemos promessas de "milagres" ou garantias ilegais. Nosso compromisso é com a
								melhor defesa técnica possível dentro da lei.
							</p>

							<div className="space-y-4">
								<div className="flex items-start gap-4 p-5 bg-blue-50 rounded-2xl border border-blue-100 transition-colors hover:bg-blue-100/50">
									<div className="bg-blue-600 p-1 rounded-full shrink-0 mt-1">
										<CheckCircle size={16} className="text-white" />
									</div>
									<div>
										<h4 className="font-bold text-gray-900">Democratização</h4>
										<p className="text-gray-600 text-sm">
											Qualidade jurídica por uma fração do custo de um escritório tradicional.
										</p>
									</div>
								</div>
								<div className="flex items-start gap-4 p-5 bg-blue-50 rounded-2xl border border-blue-100 transition-colors hover:bg-blue-100/50">
									<div className="bg-blue-600 p-1 rounded-full shrink-0 mt-1">
										<CheckCircle size={16} className="text-white" />
									</div>
									<div>
										<h4 className="font-bold text-gray-900">Agilidade</h4>
										<p className="text-gray-600 text-sm">
											O que levaria dias para ser redigido, entregamos com precisão em minutos.
										</p>
									</div>
								</div>
								<div className="flex items-start gap-4 p-5 bg-blue-50 rounded-2xl border border-blue-100 transition-colors hover:bg-blue-100/50">
									<div className="bg-blue-600 p-1 rounded-full shrink-0 mt-1">
										<CheckCircle size={16} className="text-white" />
									</div>
									<div>
										<h4 className="font-bold text-gray-900">Educação</h4>
										<p className="text-gray-600 text-sm">
											Motoristas conscientes dos seus direitos constroem um trânsito mais justo.
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className="bg-gray-50 p-12 rounded-[3rem] border border-gray-100">
							<h3 className="text-2xl font-black text-gray-900 mb-8">Nossos Valores</h3>
							<ul className="space-y-8">
								<li className="flex gap-6">
									<div className="text-4xl font-black text-blue-200">01</div>
									<div>
										<h4 className="text-xl font-bold text-gray-900 mb-2">Legalidade Estrita</h4>
										<p className="text-gray-600">
											Atuamos rigorosamente dentro das normas vigentes do CTB e resoluções do
											CONTRAN.
										</p>
									</div>
								</li>
								<li className="flex gap-6">
									<div className="text-4xl font-black text-blue-200">02</div>
									<div>
										<h4 className="text-xl font-bold text-gray-900 mb-2">Inovação Ética</h4>
										<p className="text-gray-600">
											Usamos IA para ampliar a capacidade humana, nunca para substituir a ética e a
											verdade.
										</p>
									</div>
								</li>
								<li className="flex gap-6">
									<div className="text-4xl font-black text-blue-200">03</div>
									<div>
										<h4 className="text-xl font-bold text-gray-900 mb-2">Foco no Condutor</h4>
										<p className="text-gray-600">
											Sua tranquilidade e o seu direito de ir e vir são o combustível do nosso
											trabalho.
										</p>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</section>

			{/* 6. CTA Final (Rodapé da Seção) */}
			<section className="pb-5 px-4">
				<div className="max-w-5xl mx-auto bg-blue-600 rounded-[3rem] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-200">
					{/* Decorative Blobs */}
					<div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl -ml-32 -mt-32 opacity-50"></div>
					<div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-700 rounded-full blur-3xl -mr-32 -mb-32 opacity-50"></div>

					<div className="relative z-10">
						<h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
							Não deixe seus direitos vencerem junto com o prazo.
						</h2>
						<p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto font-medium">
							Sua CNH é essencial para seu trabalho e sua liberdade. Junte-se aos milhares de
							motoristas que já utilizaram a tecnologia para proteger seu direito de dirigir.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link
								to="/upload"
								className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 text-xl font-black py-5 px-10 rounded-2xl hover:bg-blue-50 transition-all active:scale-95 shadow-lg">
								Consultar Minha Multa Grátis <ArrowRight size={24} />
							</Link>
							<Link
								to="/help"
								className="inline-flex items-center justify-center gap-2 bg-blue-700 text-white font-bold py-5 px-8 rounded-2xl hover:bg-blue-800 transition-all">
								Falar com Suporte <ChevronRight size={20} />
							</Link>
						</div>
					</div>
				</div>
			</section>
		</MainLayout>
	);
};

export default About;
