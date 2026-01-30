import React, { useMemo } from "react";
import {
	Loader2,
	CheckCircle,
	AlertCircle,
	Search,
	Lock,
	PenTool,
	User,
	FileText,
	AlertTriangle,
	Coins,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

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

	const exclusiveThesesCount = useMemo(() => Math.floor(Math.random() * (5 - 2 + 1)) + 2, []);

	const viability = isTestMode ? "Média" : analysisData.viability || "Possível";
	const summary = isTestMode
		? "Existem argumentos técnicos aplicáveis ao seu caso que podem ser explorados para contestar a infração."
		: analysisData.summary;
	const isHighViability = viability === "Alta" || viability === "Muito Alta";
	const isPossibleViability = viability === "Possível";

	return (
		<div className="max-w-2xl mx-auto py-12 px-4">
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
								Aguarde na página. A elaboração pela IA Pro pode durar até 1 minuto.
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
					className={`p-8 text-center ${isHighViability ? "bg-green-50" : isPossibleViability ? "bg-green-50/50" : "bg-yellow-50"}`}>
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
					<div className="mt-4 inline-block bg-blue-50 border border-blue-100 rounded-lg px-3 py-1 text-xs text-blue-700 font-medium">
						Análise preliminar realizada com IA Standard. O recurso final utilizará o Modelo Pro
						(Advogado Virtual).
					</div>
				</div>
				<div className="p-8">
					<h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
						<Search size={16} /> Teses Identificadas pela IA
					</h3>
					<div className="space-y-4 mb-6">
						{analysisData.arguments.slice(0, 3).map((arg, idx) => (
							<div
								key={idx}
								className="relative flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden max-h-[80px] select-none">
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
					<div className="flex items-center justify-center gap-2 mb-8 text-blue-600 font-bold bg-blue-50 p-3 rounded-lg border border-blue-100 border-dashed">
						<Lock size={16} />
						<span>+ {exclusiveThesesCount} teses exclusivas identificadas</span>
					</div>
					<div
						className={`${isTestMode ? "bg-gray-800" : "bg-blue-600"} rounded-2xl p-6 text-white text-center shadow-lg shadow-blue-200 transition-colors`}>
						<div className="flex items-center justify-center gap-2 mb-2 opacity-90">
							<Lock size={16} />
							<span className="text-sm font-medium">Recurso Completo Bloqueado</span>
						</div>
						<h3 className="text-xl font-bold mb-4">
							{isTestMode ? "Modo de Demonstração" : "Desbloquear Defesa Pronta"}
						</h3>
						<p className={`${isTestMode ? "text-gray-300" : "text-blue-100"} text-sm mb-6`}>
							{isTestMode
								? "Estes são resultados baseados em dados fictícios. Para gerar um recurso válido juridicamente, insira seus dados reais."
								: "Nossa IA já estruturou toda a argumentação jurídica baseada nas teses acima. Baixe o documento final editável agora."}
						</p>

						{isTestMode ? (
							<button
								onClick={handleReturnToRealData}
								className="w-full bg-white text-gray-900 font-black py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-sm flex items-center justify-center gap-2 mb-3">
								Preencher Meus Dados Reais <PenTool size={20} />
							</button>
						) : !currentUser ? (
							<div className="flex flex-col gap-3">
								<p className="text-blue-100 text-sm mb-2 font-medium">
									Você precisa estar logado para gerar o documento final.
								</p>
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
										navigate("/register?redirect=/upload");
									}}
									className="w-full bg-white text-blue-600 font-black py-4 rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2">
									Salvar Análise e Criar Conta <User size={20} />
								</button>
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
										navigate("/login?redirect=/upload");
									}}
									className="w-full bg-blue-700 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition-colors shadow-sm flex items-center justify-center gap-2 text-sm">
									Já tenho conta (Entrar)
								</button>
							</div>
						) : userData?.credits > 0 ? (
							<button
								onClick={handleUnlockDefense}
								disabled={loading}
								className={`w-full bg-white text-blue-600 font-black py-4 rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2 ${loading ? "opacity-75 cursor-not-allowed" : ""}`}>
								{loading ? (
									<>
										<Loader2 className="animate-spin" size={20} /> Gerando Defesa...
									</>
								) : (
									<>
										Utilizar 1 Crédito <FileText size={20} />
									</>
								)}
							</button>
						) : (
							<div className="flex flex-col gap-3">
								<div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-white text-sm">
									<div className="flex flex-col !w-full !justify-center text-center ">
										<p className="font-bold flex justify-center items-center gap-2 mb-1">
											<AlertTriangle size={16} /> Saldo Insuficiente
										</p>
										<p className="opacity-90">
											Você não possui créditos. Seus dados já estão salvos. Adquira créditos para
											finalizar agora.
										</p>
									</div>
								</div>

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
										navigate("/pricing?redirect=/upload");
									}}
									className="w-full bg-white text-blue-600 font-black py-4 rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2">
									Adquirir Créditos <Coins size={20} />
								</button>
								<button
									disabled
									className="w-full bg-gray-400/50 text-white/50 font-bold py-3 rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
									Utilizar 1 Crédito <FileText size={20} />
								</button>
							</div>
						)}

						<div className="mt-4 flex flex-col items-center">
							<span className="text-blue-200 text-xs uppercase font-bold tracking-widest mb-1">
								Seu Saldo Atual
							</span>
							<div className="bg-white/20 px-4 py-1 rounded-full text-white font-black text-lg flex items-center gap-2">
								{userData ? userData.credits : <Loader2 size={14} className="animate-spin" />}{" "}
								<span className="text-sm font-normal opacity-80">créditos</span>
							</div>
						</div>
					</div>
					<button
						onClick={() => navigate("/upload/form")}
						className="w-full text-center text-gray-400 text-sm mt-6 hover:text-gray-600">
						Voltar e editar dados
					</button>
				</div>
			</div>
		</div>
	);
};
