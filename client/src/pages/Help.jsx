import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
	Mail,
	MessageCircle,
	FileQuestion,
	ChevronDown,
	ChevronUp,
	Send,
	Loader2,
} from "lucide-react";
import { api } from "../services/api";

const Help = () => {
	const faqs = [
		{
			q: "Com o recurso gerado, é garantido que seu provimento?",
			a: "Não. A obrigação é de meio, não de fim. Nossa IA utiliza as melhores teses jurídicas possíveis para o seu caso, aumentando significativamente suas chances de deferimento, mas a decisão final cabe exclusivamente ao órgão julgador.",
		},
		{
			q: "Preciso contratar um advogado para assinar?",
			a: "Não. Na esfera administrativa de trânsito, o próprio condutor ou proprietário pode assinar sua defesa em todas as instâncias. O documento que geramos já vem pronto com a fundamentação legal, dispensando a necessidade de advogado.",
		},
		{
			q: "Os créditos expiram?",
			a: "Não! Se você comprar um pacote com múltiplos créditos, eles ficam salvos na sua conta para sempre. Você pode usar quando precisar, à medida que receber novas infrações ou tiver de apresentar recurso para outras instâncias administrativas.",
		},
		{
			q: "Serve para qual estado?",
			a: "Para todo o Brasil. A legislação de trânsito (CTB) é federal, portanto nossas defesas são válidas para órgãos de qualquer estado ou município.",
		},
		{
			q: "O que acontece se eu não recorrer?",
			a: "Se você não recorrer e apenas pagar a multa, você assume a culpa e os pontos entram automaticamente na sua CNH. No caso de multas suspensivas (como Lei Seca), você perderá o direito de dirigir por 12 meses. Recorrer é um direito constitucional e suspende esses efeitos até o fim do processo.",
		},
		{
			q: "Qual a diferença entre a análise gratuita e a paga?",
			a: "A análise gratuita identifica se existem erros formais na sua multa e qual a probabilidade de vitória. O serviço pago gera o documento jurídico completo (recurso), fundamentado com leis e jurisprudência, pronto para você protocolar.",
		},
		{
			q: "A IA é melhor que um modelo pronto da internet?",
			a: "Sim, muito. Modelos prontos são genéricos e frequentemente ignorados pelos órgãos de trânsito. Nossa IA analisa os detalhes específicos da sua multa (como a validade do bafômetro ou a sinalização do local) para criar uma defesa técnica e exclusiva.",
		},
		{
			q: "Como faço para protocolar o recurso?",
			a: "Após baixar o PDF, você deve assiná-lo e enviá-lo ao órgão autuador. Isso pode ser feito pessoalmente, via Correios (AR) ou, em muitos casos, de forma 100% online através do portal do DETRAN ou aplicativo Carteira Digital de Trânsito.",
		},
		{
			q: "O Auto Defesa garante que vou ganhar?",
			a: "Nenhum profissional sério garante vitória em processos judiciais ou administrativos. O que garantimos é uma defesa técnica de altíssimo nível, baseada nos mesmos argumentos que os melhores advogados de trânsito utilizam, por uma fração do custo.",
		},
		{
			q: "Posso recorrer de multas antigas?",
			a: "Você pode recorrer enquanto o prazo de defesa (indicado na notificação) não tiver expirado. Caso o prazo tenha vencido e você já tenha sido penalizado, ainda pode ser possível buscar a anulação judicial se houver erro grave, mas nosso foco é a esfera administrativa.",
		},
	];

	const [openIndex, setOpenIndex] = useState(null);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
	});
	const [status, setStatus] = useState({ loading: false, success: false, error: null });

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setStatus({ loading: true, success: false, error: null });

		try {
			await api.sendSupportEmail(formData);
			setStatus({ loading: false, success: true, error: null });
			setFormData({ name: "", email: "", message: "" });

			// Limpar mensagem de sucesso após 5 segundos
			setTimeout(() => {
				setStatus((prev) => ({ ...prev, success: false }));
			}, 5000);
		} catch (error) {
			console.error("Erro ao enviar email:", error);
			setStatus({
				loading: false,
				success: false,
				error: "Não foi possível enviar a mensagem. Tente novamente.",
			});
		}
	};

	return (
		<MainLayout>
			<div className="max-w-6xl mx-auto pt-10 pb-1 px-4">
				<header className="text-center mb-12">
					<h1 className="text-4xl font-black text-gray-900 mb-4">Central de Ajuda</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Estamos aqui para te ajudar em cada etapa do processo.
					</p>
				</header>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 items-stretch">
					{/* Contact Form - Takes 2 columns on large screens */}
					<div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
						<div className="flex items-center gap-4 mb-6">
							<div className="bg-blue-100 p-3 rounded-full text-blue-600">
								<Mail size={24} />
							</div>
							<div>
								<h2 className="text-2xl font-bold text-gray-900">Envie uma mensagem</h2>
								<p className="text-gray-600 text-sm">
									Responderemos para o seu email o mais breve possível.
								</p>
							</div>
						</div>

						<form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Seu Nome</label>
									<input
										type="text"
										name="name"
										required
										value={formData.name}
										onChange={handleInputChange}
										className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
										placeholder="Ex: João Silva"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Seu Email</label>
									<input
										type="email"
										name="email"
										required
										value={formData.email}
										onChange={handleInputChange}
										className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
										placeholder="Ex: joao@email.com"
									/>
								</div>
							</div>
							<div className="flex-1 flex flex-col">
								<label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
								<textarea
									name="message"
									required
									value={formData.message}
									onChange={handleInputChange}
									className="w-full flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none min-h-[150px]"
									placeholder="Descreva sua dúvida ou problema..."></textarea>
							</div>
							<button
								type="submit"
								disabled={status.loading}
								className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
								{status.loading ? (
									<Loader2 size={18} className="animate-spin" />
								) : (
									<Send size={18} />
								)}
								{status.loading ? "Enviando..." : "Enviar Mensagem"}
							</button>
							{status.success && (
								<div className="mt-4 p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 animate-in fade-in slide-in-from-top-2">
									Mensagem enviada com sucesso! Responderemos em breve.
								</div>
							)}
							{status.error && (
								<div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-2">
									{status.error}
								</div>
							)}
						</form>
					</div>

					{/* Contact Cards - Takes 1 column */}
					<div className="flex flex-col gap-6">
						{/* Email Support Card */}
						<div className="flex-1 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
							<div className="bg-blue-100 p-4 rounded-full text-blue-600 mb-4">
								<Mail size={32} />
							</div>
							<h3 className="font-bold text-xl text-gray-900 mb-2">Email</h3>
							<p className="text-gray-600 mb-6 text-sm">
								Suporte técnico e comercial por email com resposta em até 24h.
							</p>
							<a
								href="mailto:suporte@meuautodefesa.com.br"
								className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold w-full hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
								<Mail size={20} />
								Enviar Email
							</a>
						</div>

						{/* WhatsApp Card */}
						<div className="flex-1 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
							<div className="bg-green-100 p-4 rounded-full text-green-600 mb-4">
								<MessageCircle size={32} />
							</div>
							<h3 className="font-bold text-xl text-gray-900 mb-2">WhatsApp</h3>
							<p className="text-gray-600 mb-6 text-sm">
								Atendimento rápido para dúvidas, pagamentos ou suporte em geral.
							</p>
							<a
								href="https://wa.me/5561999662404?text=Ol%C3%A1%2C%20estou%20precisando%20de%20suporte%20para%20o%20app%20AutoDefesa."
								target="_blank"
								rel="noopener noreferrer"
								className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold w-full hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
								<MessageCircle size={20} />
								Falar no WhatsApp
							</a>
						</div>
					</div>
				</div>

				<div className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
					<h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
						<FileQuestion className="text-blue-600" /> Perguntas Frequentes
					</h2>
					<div className="space-y-4">
						{faqs.map((faq, idx) => (
							<div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
								<button
									onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
									className="w-full flex items-center justify-between p-5 pb-3 text-left font-bold text-gray-800 hover:bg-gray-50 transition-colors">
									{faq.q}
									{openIndex === idx ? (
										<ChevronUp size={20} className="text-gray-600" />
									) : (
										<ChevronDown size={20} className="text-gray-600" />
									)}
								</button>
								{openIndex === idx && (
									<div className="p-5 pt-5 text-gray-600 text-md leading-relaxed border-t border-gray-100 mt-2">
										{faq.a}
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default Help;
