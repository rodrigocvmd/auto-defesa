import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Upload, User, ArrowRight } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import SEO from "../components/SEO";
import { useAuth } from "../contexts/AuthContext";

const CreditSuccess = () => {
	const { currentUser } = useAuth();
	const [searchParams] = useSearchParams();
	const sessionId = searchParams.get("session_id");
	const amount = searchParams.get("amount");
	const planName = searchParams.get("plan");
	const redirect = searchParams.get("redirect");

	useEffect(() => {
		if (window.gtag && amount) {
			// 1. Evento de compra geral (GA4) - Já existia
			window.gtag("event", "purchase", {
				transaction_id: sessionId || "",
				value: parseFloat(amount),
				currency: "BRL",
				items: [
					{
						item_id: planName || "créditos",
						item_name: planName || "Créditos Auto Defesa",
						price: parseFloat(amount),
						quantity: 1,
					},
				],
			});

			// 2. NOVO: Evento específico de conversão para o Google Ads
			window.gtag("event", "conversion", {
				send_to: "AW-18013866120/PQOpCPee_KEcEIiR141D",
				value: parseFloat(amount),
				currency: "BRL",
				transaction_id: sessionId || "",
			});

			console.log("Purchase and Conversion tracked:", { amount, sessionId, planName });
		}
	}, [amount, sessionId, planName]);

	return (
		<MainLayout>
			<SEO
				title="Compra Confirmada | Auto Defesa"
				description="Créditos adicionados com sucesso. Comece a gerar seu recurso agora."
				noIndex={true}
			/>
			<div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
				<div className="mb-8 flex justify-center">
					<div className="bg-green-100 p-4 rounded-full">
						<CheckCircle className="w-16 h-16 text-green-600" />
					</div>
				</div>

				<h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
					Obrigado pela sua compra!
				</h1>

				<p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
					{currentUser
						? "Seus créditos já foram adicionados à sua conta. Agora você já pode gerar seu recurso personalizado com a nossa Inteligência Artificial."
						: "Seus créditos foram vinculados ao email informado na compra. Agora você já pode prosseguir para gerar seu recurso personalizado."}
				</p>

				<div
					className={`grid grid-cols-1 ${currentUser ? "sm:grid-cols-2" : ""} gap-6 max-w-2xl mx-auto`}>
					<Link
						to={redirect || "/upload"}
						className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95 group order-1 sm:order-1">
						<Upload className="w-6 h-6" />
						<span>Gerar Recurso Agora</span>
						<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
					</Link>

					{currentUser && (
						<Link
							to="/profile"
							className="flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold py-4 px-8 rounded-2xl transition-all active:scale-95 order-2 sm:order-2">
							<User className="w-6 h-6" />
							<span>Ver Meu Perfil</span>
						</Link>
					)}
				</div>

				<div className="mt-16 pt-8 border-t border-gray-100">
					<p className="text-gray-500">
						Dúvidas? Entre em contato com nosso{" "}
						<Link to="/help" className="text-blue-600 hover:underline font-medium">
							suporte
						</Link>
						.
					</p>
				</div>
			</div>
		</MainLayout>
	);
};

export default CreditSuccess;
