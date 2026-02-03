import React from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import SEO from "../components/SEO";
import { Shield, HelpCircle, CheckCircle, ArrowRight } from "lucide-react";

const infractionData = {
	"lei-seca": {
		title: "Recurso de Multa por Lei Seca (Art. 165 do CTB)",
		description:
			"A multa por dirigir sob influência de álcool é uma infração gravíssima que prevê multa multiplicada por 10 e suspensão da CNH por 12 meses. Nossa IA analisa erros formais no preenchimento do auto de infração e falhas nos procedimentos de fiscalização.",
		faq: [
			{ q: "Qual o valor da multa?", a: "O valor atual é de R$ 2.934,70." },
			{
				q: "Posso continuar dirigindo enquanto recorro?",
				a: "Sim, o direito de dirigir permanece até o fim de todas as instâncias do recurso administrativo.",
			},
			{
				q: "Vale a pena recorrer?",
				a: "Sim, erros formais no bafômetro ou no auto de infração podem anular a multa e a suspensão.",
			},
		],
	},
	"recusa-bafometro": {
		title: "Recurso por Recusa ao Bafômetro (Art. 165-A)",
		description:
			"A simples recusa ao teste do bafômetro não comprova embriaguez. O agente de trânsito deve observar e relatar sinais de alteração da capacidade psicomotora. Defendemos seu direito com base na técnica jurídica e ausência de provas materiais.",
		faq: [
			{
				q: "A recusa gera suspensão automática?",
				a: "Não. É aberto um processo administrativo onde você tem amplo direito de defesa antes de qualquer penalidade.",
			},
			{
				q: "Como anular essa multa?",
				a: "Focamos na falta de preenchimento correto do termo de constatação de sinais de embriaguez pelo agente.",
			},
		],
	},
	"excesso-velocidade": {
		title: "Recurso de Multa por Excesso de Velocidade (Art. 218)",
		description:
			"Multas de radar podem suspender sua CNH dependendo da velocidade excedida. Verificamos a validade do equipamento (aferição do INMETRO), a sinalização da via e a correta notificação da infração.",
		faq: [
			{
				q: "Radar sem aferição do INMETRO anula a multa?",
				a: "Sim, o equipamento deve ter sido verificado pelo INMETRO nos últimos 12 meses para ter validade.",
			},
			{
				q: "O que é a margem de erro?",
				a: "É a tolerância do equipamento. A velocidade considerada para a multa deve ser sempre menor que a medida.",
			},
		],
	},
	"ultrapassagem-indevida": {
		title: "Ultrapassagem em Local Proibido (Art. 203)",
		description:
			"Infração gravíssima com multa multiplicada por 5. Muitas vezes aplicada sem abordagem e baseada apenas na observação do agente. A defesa técnica questiona a visibilidade da sinalização e as condições do local.",
		faq: [
			{
				q: "Precisa ter foto da infração?",
				a: "Nem sempre, mas a ausência de abordagem exige um relato muito detalhado do agente, o que muitas vezes não ocorre.",
			},
			{
				q: "Qual o valor da multa?",
				a: "A multa é de R$ 1.467,35 e adiciona 7 pontos na carteira.",
			},
		],
	},
	"cnh-vencida": {
		title: "Dirigir com CNH Vencida (Art. 162, V)",
		description:
			"Dirigir com a CNH vencida há mais de 30 dias é infração gravíssima. A defesa pode focar na regularização do documento e em erros no preenchimento do auto, especialmente se o condutor não for o proprietário.",
		faq: [
			{
				q: "Existe tolerância?",
				a: "Sim, você pode dirigir por até 30 dias após o vencimento da data de validade da CNH.",
			},
			{
				q: "O carro é apreendido?",
				a: "Geralmente o veículo é retido até a apresentação de um condutor habilitado.",
			},
		],
	},
	"celular-direcao": {
		title: "Uso de Celular ao Volante (Art. 252)",
		description:
			"Uma das multas mais comuns e controversas. Para ser válida, o agente deve descrever claramente a situação. O simples fato de segurar o aparelho já caracteriza infração, mas a falta de detalhes pode anular a multa.",
		faq: [
			{
				q: "Segurar o celular parado no sinal é multa?",
				a: "Pela letra da lei, sim. Mas a defesa pode argumentar sobre a imobilização temporária do veículo.",
			},
			{
				q: "Cabe recurso sem abordagem?",
				a: "Sim, especialmente questionando a capacidade de visualização do agente fiscalizador.",
			},
		],
	},
	"manobra-perigosa": {
		title: "Manobra Perigosa ou Arrancada Brusca (Art. 175)",
		description:
			"Infração gravíssima que prevê suspensão do direito de dirigir. É uma autuação subjetiva que depende da interpretação do agente. Nossa defesa técnica busca provar a desproporcionalidade ou inexistência do risco.",
		faq: [
			{
				q: "O que caracteriza manobra perigosa?",
				a: "Derrapagem, frenagem brusca ou arrastar pneus propositalmente.",
			},
			{
				q: "Perco a carteira na hora?",
				a: "Não, a suspensão só ocorre após o trânsito em julgado do processo administrativo.",
			},
		],
	},
	"multa-moto": {
		title: "Infrações de Motocicleta (Capacete/Viseira)",
		description:
			"Multas específicas para motociclistas, como viseira levantada ou falta de capacete, possuem regras rígidas. Analisamos se a autuação respeita as resoluções do CONTRAN, como a diferenciação entre falta de capacete e viseira levantada.",
		faq: [
			{
				q: "Viseira levantada suspende a CNH?",
				a: "Atualmente é infração média e não suspende a CNH (mudança na lei). Se foi autuado como gravíssima, cabe recurso certo.",
			},
		],
	},
	"perda-ppd": {
		title: "Cassação da Permissão para Dirigir (PPD)",
		description:
			"Se você tem a PPD e cometeu infração grave, gravíssima ou reincidência em média, pode não pegar a CNH definitiva. O recurso visa anular a infração para salvar sua permissão.",
		faq: [
			{
				q: "Posso recorrer para não perder a PPD?",
				a: "Com certeza. Se o recurso anular a multa ou convertê-la (se possível), você garante sua CNH definitiva.",
			},
		],
	},
	"multa-nic": {
		title: "Multa NIC (Não Indicação de Condutor)",
		description:
			"Multa aplicada a pessoas jurídicas (empresas) que não indicam o condutor infrator. O valor é multiplicado pelo número de vezes que a mesma infração foi cometida nos últimos 12 meses.",
		faq: [
			{
				q: "Como evitar a multa NIC?",
				a: "Indicando o condutor dentro do prazo estabelecido na notificação.",
			},
			{
				q: "Cabe recurso da multa NIC?",
				a: "Sim, focando na notificação da empresa ou na legalidade da infração originária.",
			},
		],
	},
};

const InfractionPage = () => {
	const { slug } = useParams();
	const data = infractionData[slug];

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

			<div className="max-w-7xl mx-auto px-4 py-12">
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
							<p className="text-gray-500 mb-8">
								Gere sua defesa técnica agora mesmo em poucos minutos.
							</p>
							
							<Link
								to="/upload"
								className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:-translate-y-1 mb-4"
							>
								Gerar Minha Defesa Técnica
							</Link>
							
							<p className="text-xs text-gray-400">
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