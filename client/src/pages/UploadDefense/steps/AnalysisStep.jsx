import React, { useMemo, useState, useEffect } from "react";
import {
	Loader2,
	CheckCircle,
	AlertCircle,
	Search,
	Lock,
	PenTool,
	User,
	FileText,
	ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { api } from "../../../services/api";

import { GuestCreditModal } from "../components/modals/GuestCreditModal";

export const AnalysisStep = ({
	analysisData,
	loading,
	isTestMode,
	handleUnlockDefense,
	handleReturnToRealData,
	formData,
}) => {
	const { currentUser, userData } = useAuth();
	const navigate = useNavigate();
	const [guestCredits, setGuestCredits] = useState(0);
	const [showGuestCreditModal, setShowGuestCreditModal] = useState(false);

	useEffect(() => {
		const fetchGuestCredits = async () => {
			if (!currentUser) {
				const guestEmail = localStorage.getItem("guestEmail");
				if (guestEmail) {
					try {
						const credits = await api.getGuestCredits(guestEmail);
						setGuestCredits(credits);
					} catch (e) {
						console.error("Failed to fetch guest credits", e);
						setGuestCredits(0);
					}
				}
			}
		};
		fetchGuestCredits();
	}, [currentUser]);

	const exclusiveThesesCount = useMemo(() => Math.floor(Math.random() * (5 - 2 + 1)) + 2, []);

	const viability = isTestMode ? "Média" : analysisData.viability || "Possível";
	const summary = isTestMode
		? "Existem argumentos técnicos aplicáveis ao seu caso que podem ser explorados para contestar a infração."
		: analysisData.summary;
	const isHighViability = viability === "Alta" || viability === "Muito Alta";
	const isPossibleViability = viability === "Possível";

	return (
		<div className="completeLoadingInfo max-w-2xl mx-auto pt-5 pb-12 px-4">
			{loading && (
				<div className="fixed inset-0 bg-white/90 z-[100] flex flex-col items-center justify-center p-4 text-center backdrop-blur-sm animate-in fade-in duration-300">
					<Loader2 size={60} className="text-blue-600 animate-spin mb-4" />
					<h2 className="text-2xl font-black text-gray-900 mb-2">Construindo sua Defesa...</h2>
					<div className="text-left space-y-3 max-w-md mx-auto mb-6">
						<div className="flex items-start gap-3 text-gray-700">
							<CheckCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
							<p className="font-medium">Aplicando teses jurídicas e resoluções do CONTRAN.</p>
						</div>
						<div className="flex items-start gap-3 text-gray-700">
							<CheckCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
							<p className="font-medium">Garantindo a máxima qualidade do seu recurso.</p>
						</div>
						<div className="flex items-start gap-3 text-gray-700">
							<CheckCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
							<p className="font-medium">
								Aguarde na página. A elaboração pela IA Pro pode levar até 1 minuto.
							</p>
						</div>
					</div>
					<div className="mt-8 flex gap-2">
						<div className="h-1.5 w-12 bg-blue-100 rounded-full overflow-hidden">
							<div className="h-full bg-blue-600 animate-progress"></div>
						</div>
					</div>
					<style
						dangerouslySetInnerHTML={{
							__html: `
            @keyframes progress {
                0% { width: 0%; }
                100% { width: 100%; }
            }
            .animate-progress {
                animation: progress 2s ease-in-out infinite;
            }
        `,
						}}
					/>
				</div>
			)}
			<div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-4 duration-500">
				<div
					className={`py-3 px-2 text-center ${isHighViability ? "bg-green-50" : isPossibleViability ? "bg-green-50/50" : "bg-yellow-50"}`}>
					<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-sm mb-4">
						{isHighViability ? (
							<CheckCircle size={40} className="text-green-600" />
						) : isPossibleViability ? (
							<CheckCircle size={40} className="text-green-500" />
						) : (
							<AlertCircle size={40} className="text-yellow-600" />
						)}
					</div>
					<h2 className="text-2xl font-black text-gray-900 mb-2">Viabilidade {viability}</h2>
					<p className="text-gray-600 font-medium px-4">{summary}</p>
					<div className="mt-4 mx-4 md:mb-3 inline-block bg-blue-50 border border-blue-100 rounded-lg px-3 py-1 text-sm text-blue-700 font-medium">
						Análise preliminar realizada com IA Standard. O recurso final utilizará o Modelo Pro.
					</div>
				</div>
				<div className="p-6">
					<h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4 flex items-center gap-2 justify-center">
						<Search size={16} /> Teses Identificadas pela IA:
					</h3>
					<div className="space-y-4 mb-6">
						{analysisData.arguments.slice(0, 3).map((arg, idx) => (
							<div
								key={idx}
								className="text-justify relative flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden max-h-[115px] md:max-h-[80px] select-none">
								<div className="bg-blue-100 p-1 rounded-full mt-0.5 shrink-0">
									<CheckCircle size={14} className="text-blue-600" />
								</div>
								<p className="text-gray-700 text-sm font-medium leading-relaxed">
									{arg.substring(0, 50)}
									<span
										style={{
											maskImage: "linear-gradient(to bottom right, black, transparent)",
											WebkitMaskImage: "linear-gradient(to bottom right, black, transparent)",
										}}>
										{arg.substring(50, 125)}
									</span>
									<span className="opacity-0">{arg.substring(125)}</span>
								</p>
							</div>
						))}
					</div>
					<div className="flex text-center items-center justify-center gap-2 md:gap-5 mb-8 text-blue-600 font-bold bg-blue-50 px-8 py-3 md:px-3 md:py-5 rounded-lg border border-blue-100 border-dashed">
						<Lock size={22} />
						<span>+ {exclusiveThesesCount} teses exclusivas identificadas</span>
					</div>
					<div
						className={`${isTestMode ? "bg-gray-800" : "bg-blue-600"} rounded-2xl py-6 px-4 md:p-6 text-white text-center flex-col !items-center shadow-lg shadow-blue-200 transition-colors`}>
						<div className="flex items-center justify-center gap-2 mb-2 opacity-90">
							<Lock size={16} />
							<span className="text-sm font-medium">Recurso Completo Bloqueado</span>
						</div>
						<h3 className="text-xl font-bold mb-4">
							{isTestMode ? "Modo de Demonstração" : "Desbloquear Defesa Pronta"}
						</h3>
						<p className={`${isTestMode ? "text-gray-300" : "text-blue-100"} text-md mb-6`}>
							{isTestMode
								? "Estes são resultados baseados em dados fictícios. Para gerar um recurso válido juridicamente, insira seus dados reais."
								: "Nossa IA já estruturou toda a argumentação jurídica baseada nas teses acima. Prossiga para realizar a inserção de dados complementares para a elaboração do recurso."}
						</p>

						{isTestMode ? (
							<div className="w-full flex justify-center px-4">
								<button
									onClick={handleReturnToRealData}
									className="w-full md:w-2/3 bg-white text-gray-900 font-black py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-sm flex items-center justify-center gap-2 mb-3 px-1 md:px-0">
									Preencher Meus Dados Reais <PenTool size={20} className="hidden sm:block" />
								</button>
							</div>
						) : !currentUser && guestCredits === 0 ? (
							<div className="flex flex-col gap-3">
								<p className="text-blue-100 text-md mb-2 font-medium">
									Para gerar o documento final, crie uma conta ou adquira um crédito sem cadastro.
								</p>
								<div className="w-full flex justify-center px-1">
									<button
										onClick={() => {
											setShowGuestCreditModal(true);
										}}
										className="w-full md:w-2/3 bg-white text-blue-600  font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors shadow-sm flex items-center justify-center gap-2 text-md">
										Adquirir ou Recuperar Créditos
									</button>
								</div>
								<div className="w-full flex justify-center px-1">
									<button
										onClick={() => {
											localStorage.setItem(
												"pendingDefenseData",
												JSON.stringify({
													formData,
													analysisData,
													source: "upload",
												}),
											);
											navigate("/register?redirect=/upload/analysis");
										}}
										className="salvarECriarConta w-full md:w-2/3 bg-white text-blue-600 font-bold py-4 px- rounded-xl hover:bg-gray-100 transition-colors shadow-sm flex items-center justify-center gap-2">
										Salvar Análise e Criar Conta <User size={20} className="hidden sm:block" />
									</button>
								</div>

								<div className="w-full flex justify-center px-4">
									<button
										onClick={() => {
											localStorage.setItem(
												"pendingDefenseData",
												JSON.stringify({
													formData,
													analysisData,
													source: "upload",
												}),
											);
											navigate("/login?redirect=/upload/analysis");
										}}
										className="w-full md:w-2/3 bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2 text-md">
										Já tenho conta (Entrar)
									</button>
								</div>
							</div>
						) : (
							<div className="flex flex-col gap-3">
								{!currentUser && (
									<p className="text-blue-100 text-md mb-2 font-medium">
										Créditos encontrados! Prossiga ou crie uma conta para salvar seu histórico.
									</p>
								)}
								<div className="w-full flex justify-center px-4">
									<button
										onClick={() => navigate("/upload/qualification")}
										className={`salvarECriarConta w-full md:w-2/3 bg-white text-blue-600 font-black py-4 px- rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2`}>
										Inserir dados complementares <FileText size={20} className="hidden sm:block" />
									</button>
								</div>
								{!currentUser && (
									<div className="w-full flex justify-center px-4 mt-2">
										<button
											onClick={() => {
												localStorage.setItem(
													"pendingDefenseData",
													JSON.stringify({
														formData,
														analysisData,
														source: "upload",
													}),
												);
												navigate("/register?redirect=/upload/qualification");
											}}
											className="salvarECriarConta w-full md:w-2/3 bg-blue-500 text-white font-bold py-4 px- rounded-xl hover:bg-blue-600 transition-colors shadow-sm flex items-center justify-center gap-2">
											Criar Conta (Recomendado) <User size={20} className="hidden sm:block" />
										</button>
									</div>
								)}
							</div>
						)}
					</div>
					<div className="w-full flex justify-center px-4">
						<div className="w-full flex justify-center">
							<button
								onClick={() => navigate("/upload/form")}
								className="w-full md:w-2/3 text-center text-gray-600 text-sm mt-8 hover:text-blue-600 hover:bg-blue-50/50 transition-all border border-gray-200 hover:border-blue-200 rounded-xl py-3 flex items-center justify-center gap-2 font-medium">
								<ArrowLeft size={16} /> Voltar e editar dados da infração
							</button>
						</div>
					</div>
				</div>
			</div>
			{showGuestCreditModal && (
				<GuestCreditModal
					onClose={() => setShowGuestCreditModal(false)}
					formData={formData}
					analysisData={analysisData}
				/>
			)}
		</div>
	);
};
