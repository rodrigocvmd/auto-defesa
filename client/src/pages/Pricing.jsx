import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { Check, Shield, Zap, Star, Briefcase, FileText, Scale, QrCode } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { FaPix } from "react-icons/fa6";
import { api } from "../services/api";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import SEO from "../components/SEO";
import ScrollReveal from "../components/ScrollReveal";
import PixPaymentModal from "../components/PixPaymentModal";

const Pricing = () => {
	const { currentUser, userData } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const [loadingId, setLoadingId] = useState(null);
	const [selectedPlan, setSelectedPlan] = useState(null);

	const [isPixModalOpen, setIsPixModalOpen] = useState(false);
	const [selectedPixPriceId, setSelectedPixPriceId] = useState(null);

	const [timeLeft, setTimeLeft] = useState(null);
	const [promoEnded, setPromoEnded] = useState(false);
	const [isDiscountActive, setIsDiscountActive] = useState(() => {
		return localStorage.getItem("isDiscountActive") === "true";
	});

	const redirect = searchParams.get("redirect");

	const isBeforeToday = (date) => {
		if (!date) return false;
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		
		let checkDate;
		if (date && typeof date.toDate === "function") {
			checkDate = date.toDate();
		} else {
			checkDate = new Date(date);
		}
		
		return checkDate < today;
	};

	useEffect(() => {
		if (!isDiscountActive) {
			setTimeLeft(null);
			return;
		}

		let endTime;
		const getStoredEndTime = () => {
			const stored = localStorage.getItem("discountEndTime");
			return stored ? parseInt(stored, 10) : null;
		};

		endTime = getStoredEndTime();
		if (!endTime) {
			endTime = Date.now() + 60 * 60 * 1000; // 1 hora
			localStorage.setItem("discountEndTime", endTime.toString());
		}

		const updateTimer = () => {
			const now = Date.now();
			let diff = endTime - now;

			if (diff <= 0) {
				// Auto-reset timer to 1 hour
				endTime = Date.now() + 60 * 60 * 1000;
				localStorage.setItem("discountEndTime", endTime.toString());
				diff = 60 * 60 * 1000;
			}

			const h = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
			const m = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
			const s = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, "0");
			setTimeLeft({ h, m, s });
		};

		updateTimer();
		const interval = setInterval(updateTimer, 1000);
		return () => clearInterval(interval);
	}, [isDiscountActive]);

	const handleActivateDiscount = () => {
		setIsDiscountActive(true);
		localStorage.setItem("isDiscountActive", "true");
		const endTime = Date.now() + 60 * 60 * 1000;
		localStorage.setItem("discountEndTime", endTime.toString());
	};

	const BASE_PLANS = [
		{
			id: isDiscountActive ? "price_1SxBbqRTHGPeccd9D66pZoXs" : "price_1SxBbqRTHGPeccd9D66pZoXs_full",
			name: "Recurso Expresso",
			price: isDiscountActive ? "R$ 29,90" : "R$ 49,90",
			originalPrice: isDiscountActive ? "R$ 49,90" : null,
			credits: 1,
			mode: "payment",
			icon: <FileText size={24} />,
			description: "Crédito único para resolver uma multa isolada de forma rápida e técnica.",
			features: [
				"1 Crédito de Recurso",
				"Crédito vitalício / não expira",
				"Recurso fica salvo no histórico",
				"Recurso para qualquer fase da Defesa",
				"Ótimo valor por Recurso",
				"Pagamento via Cartão, Boleto ou PIX",
				`Valor por recurso: ${isDiscountActive ? "R$ 29,90" : "R$ 49,90"}`,
			],
			recommended: false,
			color: "gray",
		},
		{
			id: isDiscountActive ? "price_1SuFi7RTHGPeccd987NViaZP" : "price_1SuFi7RTHGPeccd987NViaZP_full",
			name: "Proteção Completa",
			price: isDiscountActive ? "R$ 49,90" : "R$ 149,70",
			originalPrice: isDiscountActive ? "R$ 149,70" : null,
			credits: 3,
			mode: "payment",
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
				`Valor por recurso no pacote: ${isDiscountActive ? "R$ 16,63" : "R$ 49,90"}`,
			],
			recommended: true,
			color: "blue",
		},
		{
			id: isDiscountActive ? "price_1SuFiORTHGPeccd9HKTxjPO7" : "price_1SuFiORTHGPeccd9HKTxjPO7_full",
			name: "Pacote Profissional",
			price: isDiscountActive ? "R$ 99,90" : "R$ 499,00",
			originalPrice: isDiscountActive ? "R$ 499,00" : null,
			credits: 10,
			mode: "payment",
			icon: <Briefcase size={24} />,
			description: "Este pacote é perfeito para motoristas de aplicativo, empresas e famílias.",
			features: [
				"10 Créditos de Recurso",
				"Créditos vitalícios / não expiram",
				"Todos os Recursos salvos no histórico",
				"Garante 10 Defesas Completas",
				"Melhor custo por crédito",
				"Pagamento via Cartão, Boleto ou PIX",
				`Valor por recurso no pacote: ${isDiscountActive ? "R$ 9,99" : "R$ 49,90"}`,
			],
			recommended: false,
			color: "gray",
		},
	];

	const PLANS = BASE_PLANS;

	const handleCheckout = async (plan) => {
		setSelectedPixPriceId(null);
		if (!currentUser) {
			navigate(`/register?redirect=${encodeURIComponent(location.pathname + location.search)}`);
			return;
		}

		setLoadingId(plan.id);
		try {
			const successUrl = `${window.location.origin}/credit-success?amount=${plan.price.replace("R$ ", "").replace(",", ".")}&plan=${encodeURIComponent(plan.name)}${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ""}`;
			
			const response = await api.createPreference({
				priceId: plan.id,
				userId: currentUser?.uid,
				credits: plan.credits,
				successUrl: successUrl,
			});

			if (response.init_point) {
				window.location.href = response.init_point;
			}
		} catch (error) {
			alert("Erro ao iniciar pagamento: " + error.message);
			setLoadingId(null);
		}
	};

	const handleOpenPix = (priceId) => {
		setSelectedPixPriceId(priceId);
		if (!currentUser) {
			navigate(`/register?redirect=${encodeURIComponent(location.pathname + location.search)}`);
			return;
		}
		setIsPixModalOpen(true);
	};

	return (
		<MainLayout>
			<SEO
				title="Planos e Preços"
				description="Escolha o melhor plano para sua defesa. A partir de R$ 29,90. Recurso profissional gerado por IA. Sem mensalidades."
				keywords="preço recurso multa, valor advogado transito, comprar recurso multa, planos autodefesa"
			/>
			<div className="max-w-6xl mx-auto pt-4 pb-2 px-4">
				<ScrollReveal>
					<div className="mb-10">
						<div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 rounded-[2rem] p-6 md:p-8 shadow-xl relative overflow-hidden border border-indigo-700 max-w-4xl mx-auto">
							{/* Decorative background elements */}
							<div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-blue-500 rounded-full blur-[60px] opacity-20"></div>
							<div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-purple-500 rounded-full blur-[60px] opacity-20"></div>

							<div className="relative z-10 flex flex-col items-center text-center gap-6">
								{!isDiscountActive ? (
									<div className="max-w-3xl">
										<h3 className="text-xl md:text-2xl font-black text-white mb-4">
											Identificamos que é a sua primeira compra na Auto Defesa!
										</h3>
										<p className="text-blue-100 text-md md:text-lg leading-relaxed mb-6">
											Ative o desconto temporário de novo usuário para adquirir créditos por um valor promocional exclusivo clicando no botão abaixo.
										</p>
										<button
											onClick={handleActivateDiscount}
											className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-yellow-900 font-black py-4 px-10 rounded-2xl hover:from-yellow-300 hover:to-yellow-200 transition-all shadow-xl hover:shadow-yellow-500/40 hover:-translate-y-1 active:scale-95 flex items-center gap-2 mx-auto">
											<Zap size={20} fill="currentColor" /> ATIVAR MEU DESCONTO AGORA
										</button>
									</div>
								) : (
									<div className="flex flex-col md:flex-row items-center justify-between w-full gap-8">
										<div className="text-center md:text-left">
											<h3 className="text-xl md:text-2xl font-black text-white mb-2">
												Desconto de novo usuário ativado!
											</h3>
											<p className="text-blue-100 text-md md:text-lg leading-relaxed">
												Os preços promocionais de até 80% OFF expiram em:
											</p>
										</div>

										<div className="flex items-center gap-3 shrink-0">
											<div className="bg-white/10 backdrop-blur-md rounded-xl p-3 w-20 text-center border border-white/20 shadow-lg">
												<div className="text-3xl font-black text-white">{timeLeft?.h || "00"}</div>
												<div className="text-[10px] text-blue-200 uppercase font-bold tracking-widest mt-1">
													Horas
												</div>
											</div>
											<div className="text-white text-3xl font-black flex items-center mb-5">:</div>
											<div className="bg-white/10 backdrop-blur-md rounded-xl p-3 w-20 text-center border border-white/20 shadow-lg">
												<div className="text-3xl font-black text-white">{timeLeft?.m || "00"}</div>
												<div className="text-[10px] text-blue-200 uppercase font-bold tracking-widest mt-1">
													Minutos
												</div>
											</div>
											<div className="text-white text-3xl font-black flex items-center mb-5">:</div>
											<div className="bg-white/10 backdrop-blur-md rounded-xl p-3 w-20 text-center border border-white/20 shadow-lg relative overflow-hidden">
												<div className="text-3xl font-black text-white">{timeLeft?.s || "00"}</div>
												<div className="text-[10px] text-blue-200 uppercase font-bold tracking-widest mt-1">
													Segundos
												</div>
												<div className="absolute inset-0 bg-white/5 animate-pulse"></div>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</ScrollReveal>

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
											<span className="text-3xl font-bold text-blue-400/70 line-through mb-1">
												{plan.originalPrice}
											</span>
										)}
										<div className={`text-4xl font-black ${isDiscountActive ? "text-green-500" : "text-blue-600"}`}>
											{plan.price}
										</div>
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

								<div className="space-y-3">
									<button
										id="promoBtn"
										onClick={() => handleCheckout(plan)}
										disabled={!!loadingId}
										className={`w-full py-4 rounded-xl font-bold text-lg transition-all active:scale-95 ${
											plan.recommended
												? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-indigo-300"
												: "bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-50"
										} ${loadingId && loadingId !== plan.id ? "opacity-50 cursor-not-allowed" : ""}`}>
										{loadingId === plan.id
											? "Processando..."
											: "Adquirir com Cartão"}
									</button>

									<button
										onClick={() => {
											setSelectedPixPriceId(plan.id);
											handleOpenPix(plan.id);
										}}
										disabled={!!loadingId}
										className="w-full py-3 rounded-xl font-bold text-md transition-all active:scale-95 bg-white text-green-600 border-2 border-green-500 hover:bg-green-50 flex items-center justify-center gap-2">
										<FaPix size={18} className="text-green-500" fill="currentColor" />
										Adquirir com PIX
									</button>
								</div>
							</div>
						</ScrollReveal>
					))}
				</div>

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

				<PixPaymentModal
					isOpen={isPixModalOpen}
					onClose={() => setIsPixModalOpen(false)}
					priceId={selectedPixPriceId}
					redirect={redirect}
				/>
			</div>
		</MainLayout>
	);
};

export default Pricing;
