import React from "react";
import MainLayout from "../layouts/MainLayout";
import { FileText, Search, Download, Send, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HowItWorks = () => {
	const steps = [
		{
			icon: <FileText size={32} />,
			title: "1. Faça o Upload da Multa",
			description:
				"Você pode fazer o upload do arquivo ou foto da notificação (AIT) ou digitar os dados manualmente. Nosso sistema identifica automaticamente e preenche os dados da infração.",
		},
		{
			icon: <Search size={32} />,
			title: "2. Análise Gratuita (IA Standard)",
			description:
				"Nossa IA Base faz uma varredura inicial em busca de erros formais, materiais e da viabilidade técnica do recurso. Essa etapa é 100% gratuita para você testar.",
		},
		{
			icon: <CheckCircle size={32} />,
			title: "3. Geração do Recurso (IA Pro)",
			description:
				"Ao utilizar um crédito, você ganha acesso ao nosso modelo jurídico avançado. Ele redige uma defesa completa, personalizada/direcionada e fundamentada nas resoluções do CONTRAN.",
		},
		{
			icon: <CheckCircle size={32} />,
			title: "4. Peça alterações para nossa IA",
			description:
				"Após o recurso ser gerado, você pode seguir utilizando nossa IA para requisitar mudanças específicas que entender serem benéficas ou necessárias.",
		},
		{
			icon: <Download size={32} />,
			title: "5. Baixe e Assine",
			description:
				"O documento é gerado em PDF instantaneamente. Você só precisa imprimir, assinar no campo indicado e juntar sua CNH e documento do carro.",
		},
		{
			icon: <Send size={32} />,
			title: "6. Envie ao Órgão",
			description:
				"Entregue o recurso no DETRAN, DER, PRF ou órgão autuador da sua cidade (pessoalmente ou pelos Correios) ou protocolize online se o seu estado permitir.",
		},
	];

	return (
		<MainLayout>
			<div className="max-w-4xl mx-auto pt-10 pb-2 px-4">
				<header className="text-center mb-16">
					<h1 className="text-4xl font-black text-gray-900 mb-4">Como Funciona</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Entenda o passo a passo para anular sua multa de trânsito sem burocracia e sem gastar
						com advogados.
					</p>
				</header>

				<div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
					{steps.map((step, idx) => (
						<div
							key={idx}
							className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
							<div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-blue-600 text-slate-600 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
								<span className="font-bold text-white">{idx + 1}</span>
							</div>

							<div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
								<div className="flex items-center gap-4 mb-3">
									<div className="text-blue-600 bg-blue-50 p-3 rounded-2xl">{step.icon}</div>
									<h3 className="font-bold text-xl text-gray-900">{step.title}</h3>
								</div>
								<p className="text-gray-600 leading-relaxed">{step.description}</p>
							</div>
						</div>
					))}
				</div>

				<div className="mt-10 text-center bg-gray-900 rounded-3xl p-10 text-white">
					<h2 className="text-2xl font-bold mb-4">Pronto para começar?</h2>
					<p className="text-gray-300 mb-8 max-w-xl mx-auto">
						Não deixe o prazo vencer. A análise inicial de viabilidade leva menos de 1 minuto.
					</p>
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<Link
							to="/upload"
							className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2">
							Iniciar Análise Grátis <ArrowRight size={20} />
						</Link>
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default HowItWorks;
