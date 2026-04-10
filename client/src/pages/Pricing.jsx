import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { Check, Shield, Zap, Star, Briefcase, FileText, Scale } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import SEO from "../components/SEO";
import ScrollReveal from "../components/ScrollReveal";

const Pricing = () => {
	const { currentUser } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const [loadingId, setLoadingId] = useState(null);

	const [guestModalOpen, setGuestModalOpen] = useState(false);
	const [selectedPlan, setSelectedPlan] = useState(null);
	const [guestEmail, setGuestEmail] = useState("");
	const [guestEmailError, setGuestEmailError] = useState("");

	const [timeLeft, setTimeLeft] = useState(null);
	const [promoEnded, setPromoEnded] = useState(false);

	const isDiscountRoute = location.pathname === "/pricing/discount";
	const redirect = searchParams.get("redirect");

	useEffect(() => {
		const endTimeStr = localStorage.getItem("discountEndTime");
		let endTime;
		if (!endTimeStr) {
			endTime = Date.now() + 2 * 60 * 60 * 1000;
			localStorage.setItem("discountEndTime", endTime.toString());
		} else {
			endTime = parseInt(endTimeStr, 10);
		}

		const updateTimer = () => {
			const now = Date.now();
			const diff = endTime - now;
			if (diff <= 0) {
				setTimeLeft({ h: "00", m: "00", s: "00" });
				setPromoEnded(true);
			} else {
				const h = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
				const m = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
				const s = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, "0");
				setTimeLeft({ h, m, s });
				setPromoEnded(false);
			}
		};

		updateTimer();
		const interval = setInterval(updateTimer, 1000);
		return () => clearInterval(interval);
	}, []);

	// IMPORTANTE:
	// O erro "No such price: 'prod_...'" ocorre porque você copiou o ID do PRODUTO (começa com prod_)
	// ao invés do ID do PREÇO (começa com price_).
	// No Dashboard da Stripe, vá em Produtos > Clique no produto > Role até "Preços" > Copie o ID que começa com 'price_'.
	const BASE_PLANS = [
		{
			id: "price_1SxBbqRTHGPeccd9D66pZoXs", // Substitua pelo ID real price_...
			discountId: "price_discount_expresso",
			name: "Recurso Expresso",
			price: "R$ 17,90",
			originalPrice: "R$ 29,90",
			discountPrice: "R$ 8,95",
			discountFeatureText: "Valor por recurso no pacote: R$ 8,95",
			credits: 1,
			mode: "payment", // Pagamento Único
			icon: <FileText size={24} />,
			description: "Crédito único para resolver uma multa isolada de forma rápida e técnica.",
			features: [
				"1 Crédito de Recurso",
				"Crédito vitalício / não expira",
				"Recurso fica salvo no histórico",
				"Recurso para qualquer fase da Defesa",
				"Ótimo valor por Recurso",
				"Pagamento via Cartão, Boleto ou PIX",
				"Valor por recurso no pacote: R$ 17,90",
			],
			recommended: false,
			color: "gray",
		},
		{
			id: "price_1SuFi7RTHGPeccd987NViaZP", // Substitua pelo ID real price_...
			discountId: "price_discount_completa",
			name: "Proteção Completa",
			price: "R$ 27,90",
			originalPrice: "R$ 49,90",
			discountPrice: "R$ 13,95",
			discountFeatureText: "Valor por recurso no pacote: R$ 4,65",
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
				"Pagamento via Cartão, Boleto ou PIX",
				"Valor por recurso no pacote: R$ 9,30",
			],
			recommended: true,
			color: "blue",
		},
		{
			id: "price_1SuFiORTHGPeccd9HKTxjPO7", // Substitua pelo ID real price_...
			discountId: "price_discount_profissional",
			name: "Pacote Profissional",
			price: "R$ 47,90",
			originalPrice: "R$ 99,90",
			discountPrice: "R$ 23,95",
			discountFeatureText: "Valor por recurso no pacote: R$ 2,40",
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
				"Pagamento via Cartão, Boleto ou PIX",
				"Valor por recurso no pacote: R$ 4,79",
			],
			recommended: false,
			color: "gray",
		},
	];

	const PLANS = BASE_PLANS.map(plan => {
		if (isDiscountRoute && !promoEnded) {
			const updatedFeatures = [...plan.features];
			updatedFeatures[updatedFeatures.length - 1] = plan.discountFeatureText;
			
			return {
				...plan,
				id: plan.discountId,
				price: plan.discountPrice,
				originalPrice: plan.price,
				features: updatedFeatures
			};
		}
		return plan;
	});

	const handleSubscribe = async (plan) => {
		if (!currentUser) {
			setSelectedPlan(plan);
			setGuestModalOpen(true);
			return;
		}

		setLoadingId(plan.id);
		try {
			const response = await api.createCheckoutSession({
				priceId: plan.id,
				userId: currentUser.uid,
				credits: plan.credits, // Passa a quantidade de créditos do plano
				mode: plan.mode, // Passa o modo (payment) para a API
				successUrl: `${window.location.origin}/credit-success?session_id={CHECKOUT_SESSION_ID}&amount=${plan.price.replace("R$ ", "").replace(",", ".")}&plan=${encodeURIComponent(plan.name)}`,
			});

			if (response.url) {
				window.location.href = response.url;
			}
		} catch (error) {
			alert("Erro ao iniciar pagamento: " + error.message);
			setLoadingId(null);
		}
	};

	const handleGuestCheckout = async (e) => {
		e.preventDefault();
		if (!guestEmail || !/^\S+@\S+\.\S+$/.test(guestEmail)) {
			setGuestEmailError("Por favor, insira um email válido.");
			return;
		}

		setGuestEmailError("");
		setGuestModalOpen(false);
		setLoadingId(selectedPlan.id);

		try {
			const response = await api.createCheckoutSession({
				priceId: selectedPlan.id,
				credits: selectedPlan.credits,
				mode: selectedPlan.mode,
				guestEmail: guestEmail,
				successUrl: `${window.location.origin}/credit-success?session_id={CHECKOUT_SESSION_ID}&amount=${selectedPlan.price.replace("R$ ", "").replace(",", ".")}&plan=${encodeURIComponent(selectedPlan.name)}`,
			});

			if (response.url) {
				localStorage.setItem("guestEmail", guestEmail);
				window.location.href = response.url;
			}
		} catch (error) {
			alert("Erro ao iniciar pagamento como convidado: " + error.message);
			setLoadingId(null);
		}
	};

	return (
		<MainLayout>
			<SEO
				title="Planos e Preços"
				description="Escolha o melhor plano para sua defesa. A partir de R$ 17,90. Recurso profissional gerado por IA. Sem mensalidades."
				keywords="preço recurso multa, valor advogado transito, comprar recurso multa, planos autodefesa"
			/>
			<div className="max-w-6xl mx-auto pt-12 pb-2 px-4">
				<ScrollReveal>
					<div className="text-center mb-10">
						<h1 className="text-4xl font-black text-gray-900 mb-4">
							Escolha o melhor pacote de defesa para você
						</h1>
						<p className="text-xl text-gray-600 max-w-1xl mx-auto">
							Não pague multas injustas. Utilize nossa tecnologia para proteger sua CNH e seu bolso.
						</p>
					</div>
				</ScrollReveal>

				{isDiscountRoute && timeLeft && (
					<ScrollReveal>
						<div className="mb-12 bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden border border-indigo-700">
							{/* Decorative background elements */}
							<div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-500 rounded-full blur-[80px] opacity-30"></div>
							<div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500 rounded-full blur-[80px] opacity-30"></div>
							
							<div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
								<div className="text-center lg:text-left max-w-2xl">
									<h3 className="text-2xl font-black text-white mb-2">
										Tempo restante para aproveitar o desconto de 50%
									</h3>
									<p className="text-blue-100 text-lg leading-relaxed">
										As ofertas abaixo estão com <strong>metade do preço</strong> por tempo limitado.
									</p>
								</div>
								
								<div className="flex flex-col items-center gap-6 shrink-0 w-full lg:w-auto">
									<div className="flex gap-4">
										<div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 w-20 text-center border border-white/20 shadow-xl">
											<div className="text-3xl font-black text-white">{timeLeft.h}</div>
											<div className="text-[11px] text-blue-200 uppercase font-bold tracking-widest mt-1">Hora</div>
										</div>
										<div className="text-white text-3xl font-black flex items-center mb-5">:</div>
										<div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 w-20 text-center border border-white/20 shadow-xl">
											<div className="text-3xl font-black text-white">{timeLeft.m}</div>
											<div className="text-[11px] text-blue-200 uppercase font-bold tracking-widest mt-1">Min</div>
										</div>
										<div className="text-white text-3xl font-black flex items-center mb-5">:</div>
										<div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 w-20 text-center border border-white/20 shadow-xl relative overflow-hidden">
											<div className="text-3xl font-black text-white">{timeLeft.s}</div>
											<div className="text-[11px] text-blue-200 uppercase font-bold tracking-widest mt-1">Seg</div>
											{/* Subtle pulse animation for seconds */}
											<div className="absolute inset-0 bg-white/5 animate-pulse"></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</ScrollReveal>
				)}

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{PLANS.map((plan, idx) => (
						<ScrollReveal key={plan.name} delay={idx * 100}>
							<div
								className={`relative flex flex-col bg-white rounded-3xl p-8 border-2 transition-all hover:scale-105 h-full ${plan.recommended ? "border-blue-600 shadow-2xl shadow-blue-100 ring-4 ring-blue-50" : "border-gray-100 shadow-xl"}`}>
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

								<p className="text-gray-600 text-sm mb-6 min-h-[40px]">{plan.description}</p>

								<div className="mb-6 text-center">
									<div className="flex flex-col items-center justify-center">
										{plan.originalPrice && (
											<span className="text-3xl font-bold text-gray-400 line-through mb-1">
												{plan.originalPrice}
											</span>
										)}
										<div className={`text-4xl font-black ${isDiscountRoute && !promoEnded ? "text-green-500" : "text-blue-600"}`}>{plan.price}</div>
									</div>
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
												className={`mt-0.5 rounded-full p-0.5 shrink-0 ${plan.recommended ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-600"}`}>
												<Check size={12} strokeWidth={3} />
											</div>
											{feature}
										</li>
									))}
								</ul>

								<button
									onClick={() => handleSubscribe(plan)}
									disabled={!!loadingId || (isDiscountRoute && promoEnded)}
									className={`w-full py-4 rounded-xl font-bold text-lg transition-all active:scale-95 ${
										plan.recommended
											? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-indigo-300"
											: "bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-50"
									} ${loadingId && loadingId !== plan.id ? "opacity-50 cursor-not-allowed" : ""} ${(isDiscountRoute && promoEnded) ? "bg-gray-400 !text-gray-200 opacity-100 !shadow-none cursor-not-allowed" : ""}`}>
									{loadingId === plan.id ? "Processando..." : ((isDiscountRoute && promoEnded) ? "Fim da promoção" : "Selecionar Produto")}
								</button>
							</div>
						</ScrollReveal>
					))}
				</div>

				{!isDiscountRoute && timeLeft && (
					<ScrollReveal>
						<div className="mt-16 bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden border border-indigo-700">
							{/* Decorative background elements */}
							<div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-500 rounded-full blur-[80px] opacity-30"></div>
							<div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500 rounded-full blur-[80px] opacity-30"></div>
							
							<div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
								<div className="text-center lg:text-left max-w-2xl">
									<h3 className="text-3xl font-black text-white mb-4">
										Ainda não está convencido?
									</h3>
									<p className="text-blue-100 text-xl leading-relaxed">
										Adquira seu Recurso nas próximas horas e ganhe <strong>50% de desconto</strong> em qualquer pacote para testar e aprovar a qualidade dos nossos recursos!
									</p>
								</div>
								
								<div className="flex flex-col items-center gap-6 shrink-0 w-full lg:w-auto">
									<div className="flex gap-4">
										<div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 w-20 text-center border border-white/20 shadow-xl">
											<div className="text-3xl font-black text-white">{timeLeft.h}</div>
											<div className="text-[11px] text-blue-200 uppercase font-bold tracking-widest mt-1">Hora</div>
										</div>
										<div className="text-white text-3xl font-black flex items-center mb-5">:</div>
										<div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 w-20 text-center border border-white/20 shadow-xl">
											<div className="text-3xl font-black text-white">{timeLeft.m}</div>
											<div className="text-[11px] text-blue-200 uppercase font-bold tracking-widest mt-1">Min</div>
										</div>
										<div className="text-white text-3xl font-black flex items-center mb-5">:</div>
										<div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 w-20 text-center border border-white/20 shadow-xl relative overflow-hidden">
											<div className="text-3xl font-black text-white">{timeLeft.s}</div>
											<div className="text-[11px] text-blue-200 uppercase font-bold tracking-widest mt-1">Seg</div>
											{/* Subtle pulse animation for seconds */}
											<div className="absolute inset-0 bg-white/5 animate-pulse"></div>
										</div>
									</div>

									<button 
										onClick={() => navigate("/pricing/discount")}
										disabled={promoEnded}
										className={`w-full py-4 px-8 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-95 flex justify-center items-center gap-2 ${promoEnded ? 'bg-gray-500 text-gray-300 cursor-not-allowed border border-gray-400' : 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-yellow-900 hover:from-yellow-300 hover:to-yellow-200 border border-yellow-200 shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:-translate-y-1'}`}
									>
										{promoEnded ? "Fim da promoção" : (
											<>
												Acessar 50% de Desconto <Zap size={20} className="text-yellow-700" fill="currentColor" />
											</>
										)}
									</button>
								</div>
							</div>
						</div>
					</ScrollReveal>
				)}

				<ScrollReveal>
					<div className="mt-10 md:mt-14 bg-gray-50 p-8 md:py-8 rounded-3xl border border-gray-200">
						<div className="text-center mb-2">
							<h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
								<Scale size={20} className="text-blue-600" />
								Tecnologia Jurídica Transparente
							</h2>
							<p className="text-gray-600 max-w-5xl mx-auto text-sm leading-relaxed">
								Acreditamos na transparência. Nossos testes gratuitos e demonstrações utilizam um
								modelo de IA Standard para análise rápida de viabilidade. Ao adquirir um crédito, o
								recurso final é gerado exclusivamente pelo nosso <strong>Modelo Pro</strong>,
								treinado especificamente com{" "}
								<strong>
									jurisprudência atual de trânsito, tendências de julgamento de recursos, últimas
									resoluções do CONTRAN e do Código de Trânsito Brasileiro
								</strong>{" "}
								para máxima assertividade.
							</p>
						</div>
					</div>
				</ScrollReveal>

				{guestModalOpen && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
						<div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
							<h3 className="text-2xl font-black text-gray-900 mb-4 flex !justify-center">
								Continuar sem login
							</h3>
							<p className="text-gray-600 mb-6 text-sm">
								<strong>Recomendamos criar uma conta</strong> para ter um histórico salvo dos seus recursos e melhor
								suporte. No entanto, você pode prosseguir apenas informando um email ao qual seus
								créditos ficarão vinculados.
							</p>

							<form onSubmit={handleGuestCheckout} className="space-y-4">
								<div>
									<label
										htmlFor="guestEmail"
										className="text-md font-bold text-gray-700 mb-3 flex justify-center">
										Email de vinculação:
									</label>
									<input
										type="email"
										id="guestEmail"
										className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
										placeholder="exemplo@email.com"
										value={guestEmail}
										onChange={(e) => setGuestEmail(e.target.value)}
										required
									/>
									{guestEmailError && (
										<p className="text-red-500 text-xs mt-1">{guestEmailError}</p>
									)}
								</div>

								<div className="flex flex-col gap-3 mt-6">
									<button
										type="submit"
										disabled={!!loadingId}
										className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95 disabled:opacity-50">
										{loadingId ? "Processando..." : "Continuar para o Pagamento"}
									</button>
									<button
										type="button"
										onClick={() => navigate("/register")}
										className="w-full bg-indigo-50 text-indigo-700 font-bold py-3 rounded-xl hover:bg-indigo-100 transition-all border border-indigo-200">
										Criar uma conta primeiro
									</button>
									<button
										type="button"
										onClick={() => setGuestModalOpen(false)}
										className="w-full text-gray-500 hover:text-gray-700 text-sm py-2 font-medium underline">
										Cancelar
									</button>
								</div>
							</form>
						</div>
					</div>
				)}
			</div>
		</MainLayout>
	);
};

export default Pricing;
