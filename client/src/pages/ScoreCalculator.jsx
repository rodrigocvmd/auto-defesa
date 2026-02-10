import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import SEO from "../components/SEO";
import { Shield, AlertTriangle, Info, ArrowRight, RefreshCcw, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ScoreCalculator = () => {
	const [scores, setScores] = useState({
		leve: 0,
		media: 0,
		grave: 0,
		gravissima: 0,
	});

	const [totalPoints, setTotalPoints] = useState(0);
	const [limit, setLimit] = useState(40);

	useEffect(() => {
		const points = scores.leve * 3 + scores.media * 4 + scores.grave * 5 + scores.gravissima * 7;
		setTotalPoints(points);

		// Regras de limite CNH atualizadas
		if (scores.gravissima >= 2) {
			setLimit(20);
		} else if (scores.gravissima === 1) {
			setLimit(30);
		} else {
			setLimit(40);
		}
	}, [scores]);

	const updateScore = (type, value) => {
		const newValue = Math.max(0, parseInt(value) || 0);
		setScores((prev) => ({ ...prev, [type]: newValue }));
	};

	const reset = () => {
		setScores({ leve: 0, media: 0, grave: 0, gravissima: 0 });
	};

	const progress = Math.min(100, (totalPoints / limit) * 100);
	const isDanger = totalPoints >= limit;
	const isWarning = totalPoints >= limit * 0.8 && totalPoints < limit;

	const shareOnWhatsApp = () => {
		const status = isDanger ? "ESTOU EM RISCO DE SUSPENSÃO" : isWarning ? "ESTOU EM ALERTA" : "ESTOU REGULAR";
		const text = `Fiz a simulação da minha pontuação de CNH no AutoDefesa:\n\n` +
					 `📊 Meus Pontos: ${totalPoints}\n` +
					 `📉 Meu Limite: ${limit}\n` +
					 `🚨 Status: ${status}\n\n` +
					 `Calcule o seu também em: ${window.location.href}`;
		window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
	};

	return (
		<MainLayout>
			<SEO
				title="Calculadora de Pontos CNH | Auto Defesa"
				description="Calcule seus pontos na CNH e saiba o seu limite de acordo com as novas regras de trânsito."
			/>

			<div className="max-w-4xl mx-auto px-4 py-12">
				<div className="text-center mb-12">
					<h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
						Calculadora de Pontos CNH
					</h1>
					<p className="text-gray-600 text-lg">
						Descubra quantos pontos você tem e qual o seu limite atual.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Input Section */}
					<div className="lg:col-span-2 space-y-6">
						<div className="bg-white rounded-3xl shadow-xl shadow-blue-100/50 border border-blue-50 p-8">
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
									Insira suas infrações
								</h2>
								<button
									onClick={reset}
									className="text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1 text-sm font-medium">
									<RefreshCcw size={14} /> Limpar
								</button>
							</div>

							<div className="space-y-6">
								{[
									{ id: "leve", label: "Leve", points: 3, color: "bg-green-100 text-green-700" },
									{ id: "media", label: "Média", points: 4, color: "bg-blue-100 text-blue-700" },
									{ id: "grave", label: "Grave", points: 5, color: "bg-orange-100 text-orange-700" },
									{
										id: "gravissima",
										label: "Gravíssima",
										points: 7,
										color: "bg-red-100 text-red-700",
									},
								].map((item) => (
									<div key={item.id} className="flex items-center justify-between gap-4">
										<div>
											<p className="font-bold text-gray-900">{item.label}</p>
											<span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.color}`}>
												{item.points} Pontos
											</span>
										</div>
										<div className="flex items-center gap-3">
											<button
												onClick={() => updateScore(item.id, scores[item.id] - 1)}
												className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors font-bold text-xl text-gray-600">
												-
											</button>
											<input
												type="number"
												value={scores[item.id]}
												onChange={(e) => updateScore(item.id, e.target.value)}
												className="w-16 text-center font-bold text-lg text-gray-900 border-none focus:ring-0"
											/>
											<button
												onClick={() => updateScore(item.id, scores[item.id] + 1)}
												className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 font-bold text-xl">
												+
											</button>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Info Card */}
						<div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4">
							<Info className="text-blue-600 shrink-0" size={24} />
							<div>
								<h4 className="font-bold text-blue-900 mb-1">Entenda as Regras</h4>
								<p className="text-sm text-blue-800 leading-relaxed">
									A pontuação máxima da CNH mudou. O limite agora depende de quantas infrações
									gravíssimas você cometeu nos últimos 12 meses.
								</p>
							</div>
						</div>
					</div>

					{/* Result Section */}
					<div className="space-y-6">
						<div className="bg-white rounded-3xl shadow-xl shadow-blue-100/50 border border-blue-50 p-8 sticky top-24">
							<h3 className="text-center text-gray-600 font-bold uppercase tracking-widest text-xs mb-6">
								Seu Status Atual
							</h3>

							<div className="text-center mb-8">
								<div className="relative inline-block">
									<span className={`text-6xl font-black ${isDanger ? 'text-red-600' : isWarning ? 'text-orange-500' : 'text-blue-600'}`}>
										{totalPoints}
									</span>
									<span className="text-gray-400 font-bold ml-2">/ {limit}</span>
								</div>
								<p className="text-sm font-bold text-gray-500 mt-2 uppercase">Pontos Acumulados</p>
							</div>

							{/* Progress Bar */}
							<div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-6">
								<div 
									className={`h-full transition-all duration-500 ${isDanger ? 'bg-red-600' : isWarning ? 'bg-orange-500' : 'bg-blue-600'}`}
									style={{ width: `${progress}%` }}
								></div>
							</div>

							{/* Rule Indicator */}
							<div className="space-y-4 mb-6">
								<div className={`p-4 rounded-2xl border ${scores.gravissima >= 2 ? 'bg-red-50 border-red-100 text-red-800' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>
									<p className="text-xs font-bold uppercase mb-1">Limite: 20 Pontos</p>
									<p className="text-[10px] leading-tight">2 ou mais infrações gravíssimas</p>
								</div>
								<div className={`p-4 rounded-2xl border ${scores.gravissima === 1 ? 'bg-orange-50 border-orange-100 text-orange-800' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>
									<p className="text-xs font-bold uppercase mb-1">Limite: 30 Pontos</p>
									<p className="text-[10px] leading-tight">Apenas 1 infração gravíssima</p>
								</div>
								<div className={`p-4 rounded-2xl border ${scores.gravissima === 0 ? 'bg-green-50 border-green-100 text-green-800' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>
									<p className="text-xs font-bold uppercase mb-1">Limite: 40 Pontos</p>
									<p className="text-[10px] leading-tight">Nenhuma infração gravíssima</p>
								</div>
							</div>

							{isDanger && (
								<div className="bg-red-600 text-white rounded-2xl p-4 mb-6 flex gap-3 animate-pulse">
									<AlertTriangle className="shrink-0" size={20} />
									<p className="text-xs font-bold leading-tight">
										LIMITE ATINGIDO! Você corre risco iminente de suspensão da CNH.
									</p>
								</div>
							)}

							<div className="space-y-3">
								<Link 
									to="/upload"
									className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-200 hover:-translate-y-1"
								>
									Recorrer Agora <ArrowRight size={18} />
								</Link>
								
								<button 
									onClick={shareOnWhatsApp}
									className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-2xl transition-all shadow-md shadow-green-100"
								>
									<MessageCircle size={18} /> Compartilhar Resultado
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default ScoreCalculator;