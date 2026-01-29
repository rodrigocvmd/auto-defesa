import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { Check, Shield, Zap, Star, Briefcase, FileText, Scale } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import SEO from "../components/SEO";

const Pricing = () => {
	const { currentUser } = useAuth();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [loadingId, setLoadingId] = useState(null);

	const redirect = searchParams.get("redirect");

	// IMPORTANTE:
	// O erro "No such price: 'prod_...'" ocorre porque você copiou o ID do PRODUTO (começa com prod_)
	// ao invés do ID do PREÇO (começa com price_).
	// No Dashboard da Stripe, vá em Produtos > Clique no produto > Role até "Preços" > Copie o ID que começa com 'price_'.
	const PLANS = [
		{
			id: "price_1SsUk8Qphe4gmDmiJhdjZsL4", // Substitua pelo ID real price_...
			name: "Recurso Expresso",
			price: "R$ 16,90",
			credits: 1,
			mode: "payment", // Pagamento Único
			icon: <FileText size={24} />,
			description: "Crédito único para resolver uma multa isolada de forma rápida e técnica.",
			features: [
				"1 Crédito de Recurso",
				"Crédito vitalício / não expira",
				"Recurso fica salvo no histórico",
				"Recurso para qualquer fase da Defesa",
				"Custo padrão por Recurso",
			],
			recommended: false,
			color: "gray",
		},
		{
			id: "price_1SsUkvQphe4gmDmiExt4PDuw", // Substitua pelo ID real price_...
			name: "Proteção Completa",
			price: "R$ 27,90",
			credits: 3,
			mode: "payment", // Pagamento Único
			icon: <Shield size={24} />,
			description:
				"O pacote mais escolhido. Garante a defesa em todas as instâncias administrativas.",
			features: [
				"3 Créditos de Recurso",
				"Créditos vitalícios / não expiram",
				"Todos os Recursos salvos no histórico",
				"Garante as 3 fases da Defesa",
				"Custo por Recurso reduzido",
			],
			recommended: true,
			color: "blue",
		},
		{
			id: "price_1SsUlDQphe4gmDmimwZpXhQg", // Substitua pelo ID real price_...
			name: "Pacote Profissional",
			price: "R$ 47,90",
			credits: 10,
			mode: "payment", // Pagamento Único
			icon: <Briefcase size={24} />,
			description: "Este pacote é perfeito para motoristas de aplicativo, empresas e famílias.",
			features: [
				"10 Créditos de Recurso",
				"Créditos vitalícios / não expiram",
				"Todos os Recursos salvos no histórico",
				"Garante 10 Defesas Completas",
				"Melhor custo por crédito",
			],
			recommended: false,
			color: "gray",
		},
	];

	const handleSubscribe = async (plan) => {
		if (!currentUser) {
			navigate("/register");
			return;
		}

		setLoadingId(plan.id);
		try {
			const response = await api.createCheckoutSession({
				priceId: plan.id,
				userId: currentUser.uid,
				credits: plan.credits, // Passa a quantidade de créditos do plano
				mode: plan.mode, // Passa o modo (payment) para a API
				successUrl: redirect ? window.location.origin + redirect : undefined,
			});

			if (response.url) {
				window.location.href = response.url;
			}
		} catch (error) {
			alert("Erro ao iniciar pagamento: " + error.message);
			setLoadingId(null);
		}
	};

	return (
		<MainLayout>
			<SEO
				title="Planos e Preços"
				description="Escolha o melhor plano para sua defesa. A partir de R$ 16,90. Recurso profissional gerado por IA. Sem mensalidades."
				keywords="preço recurso multa, valor advogado transito, comprar recurso multa, planos autodefesa"
			/>
			<div className="max-w-6xl mx-auto py-12 px-4">
				<div className="text-center mb-16">
					<h1 className="text-4xl font-black text-gray-900 mb-4">
						Escolha o melhor pacote de defesa para você
					</h1>
					<p className="text-xl text-gray-600 max-w-1xl mx-auto">
						Não pague multas injustas. Utilize nossa tecnologia jurídica para proteger sua CNH e seu
						bolso.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{PLANS.map((plan) => (
						<div
							key={plan.name}
							className={`relative flex flex-col bg-white rounded-3xl p-8 border-2 transition-all hover:scale-105 ${plan.recommended ? "border-blue-600 shadow-2xl shadow-blue-100 ring-4 ring-blue-50" : "border-gray-100 shadow-xl"}`}>
							{plan.recommended && (
								<div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm font-bold px-4 py-1 rounded-full flex items-center gap-1 shadow-md">
									<Star size={14} fill="currentColor" /> MAIS ESCOLHIDO
								</div>
							)}

							<div className="flex items-center justify-center gap-4 mb-6">
								<div
									className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${plan.recommended ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}>
									{plan.icon}
								</div>
								<h3 className="text-2xl font-bold text-gray-900 leading-tight text-left">
									{plan.name.split(" ").map((word, i) => (
										<React.Fragment key={i}>
											{word}
											<br />
										</React.Fragment>
									))}
								</h3>
							</div>

							<p className="text-gray-500 text-sm mb-6 min-h-[40px]">{plan.description}</p>

							<div className="mb-6 text-center">
								<div className="text-4xl font-black text-gray-900">{plan.price}</div>
								{plan.credits >= 1 && (
									<div className="text-sm font-bold text-green-600 bg-green-50 inline-block px-2 py-1 rounded mt-5">
										{plan.credits} {plan.credits === 1 ? "crédito incluso" : "créditos inclusos"}
									</div>
								)}
							</div>

							<ul className="space-y-4 mb-8 flex-1">
								{plan.features.map((feature, idx) => (
									<li key={idx} className="flex items-start gap-3 text-gray-600 text-sm">
										<div
											className={`mt-0.5 rounded-full p-0.5 shrink-0 ${plan.recommended ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-500"}`}>
											<Check size={12} strokeWidth={3} />
										</div>
										{feature}
									</li>
								))}
							</ul>

							<button
								onClick={() => handleSubscribe(plan)}
								disabled={!!loadingId}
								className={`w-full py-4 rounded-xl font-bold text-lg transition-all active:scale-95 ${
									plan.recommended
										? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-indigo-300"
										: "bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-50"
								} ${loadingId && loadingId !== plan.id ? "opacity-50 cursor-not-allowed" : ""}`}>
								{loadingId === plan.id ? "Processando..." : "Selecionar Produto"}
							</button>
						</div>
					))}
				</div>

				<div className="mt-16 bg-gray-50 p-8 rounded-3xl border border-gray-200">
					<div className="text-center mb-8">
						<h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
							<Scale size={20} className="text-blue-600" />
							Tecnologia Jurídica Transparente
						</h2>
						<p className="text-gray-600 max-w-5xl mx-auto text-sm leading-relaxed">
							Acreditamos na transparência. Nossos testes gratuitos e demonstrações utilizam um
							modelo de IA Standard para análise rápida de viabilidade. Ao adquirir um crédito, o
							recurso final é gerado exclusivamente pelo nosso{" "}
							<strong>Modelo Pro (Advogado Virtual)</strong>, treinado especificamente com
							jurisprudências, resoluções do CONTRAN e o Código de Trânsito Brasileiro para máxima
							assertividade.
						</p>
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default Pricing;
