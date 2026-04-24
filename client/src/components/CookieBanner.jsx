import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { initializeAnalytics } from "../services/analytics";

const CookieBanner = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const consent = localStorage.getItem("cookieConsent");
		if (!consent) {
			// Pequeno delay para a animação de entrada ficar mais natural
			const timer = setTimeout(() => setIsVisible(true), 1000);
			return () => clearTimeout(timer);
		}
	}, []);

	const handleConsent = (status) => {
		localStorage.setItem("cookieConsent", status);

		if (status === "granted") {
			// Atualiza o Consent Mode do Google
			if (typeof window !== "undefined" && window.gtag) {
				window.gtag("consent", "update", {
					ad_storage: "granted",
					ad_user_data: "granted",
					ad_personalization: "granted",
					analytics_storage: "granted",
				});
			}
			// Mantém a sua inicialização existente
			initializeAnalytics();
		}

		setIsVisible(false);
	};

	if (!isVisible) return null;

	return (
		<div className="fixed bottom-0 left-0 w-full z-[100] p-4 animate-in fade-in slide-in-from-bottom-10 duration-700">
			<div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-md border border-gray-200 rounded-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] p-6 md:p-8">
				<div className="flex flex-col md:flex-row items-center justify-between gap-6">
					<div className="flex-1 text-center md:text-left">
						<h4 className="text-gray-900 font-bold mb-1">Valorizamos sua privacidade 🛡️</h4>
						<p className="text-gray-600 text-sm leading-relaxed">
							Utilizamos cookies para melhorar sua experiência e analisar o tráfego de forma
							anônima. Ao continuar, você concorda com nossa{" "}
							<Link
								to="/privacy"
								className="text-blue-600 font-semibold underline underline-offset-2 hover:text-blue-700">
								Política de Privacidade
							</Link>
							.
						</p>
					</div>

					<div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
						<button
							onClick={() => handleConsent("denied")}
							className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors border border-gray-200 rounded-xl hover:bg-gray-50">
							Apenas Essenciais
						</button>
						<button
							onClick={() => handleConsent("granted")}
							className="w-full sm:w-auto px-8 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 rounded-xl active:scale-95">
							Aceitar Todos
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CookieBanner;
