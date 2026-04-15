import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
	Shield,
	User,
	Menu,
	X,
	BookOpen,
	ChevronDown,
	ChevronUp,
	Info,
	Zap,
	Coins,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import VerificationBanner from "../components/VerificationBanner";
import GuestBanner from "../components/GuestBanner";
import CookieBanner from "../components/CookieBanner";

// Global flag to track if the warning has been shown during this session (until refresh)
let hasShownWarningInitially = false;

const MainLayout = ({ children }) => {
	const location = useLocation();
	const navigate = useNavigate();
	const { currentUser } = useAuth();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isUtilitiesOpen, setIsUtilitiesOpen] = useState(false);
	const [isWarningVisible, setIsWarningVisible] = useState(!hasShownWarningInitially);
	const isHome = location.pathname === "/";

	const [guestCredits, setGuestCredits] = useState(0);
	const [showGuestCredits, setShowGuestCredits] = useState(false);
	const guestEmail = localStorage.getItem("guestEmail");

	useEffect(() => {
		if (!currentUser && guestEmail) {
			api
				.getGuestCredits(guestEmail)
				.then((credits) => {
					setGuestCredits(credits);
					if (credits > 0) {
						setShowGuestCredits(true);
					}
				})
				.catch(() => setGuestCredits(0));
		}
	}, [currentUser, guestEmail]);

	useEffect(() => {
		if (showGuestCredits) {
			const timer = setTimeout(() => {
				setShowGuestCredits(false);
			}, 7000);
			return () => clearTimeout(timer);
		}
	}, [showGuestCredits]);

	useEffect(() => {
		// After the first render where it might be shown, mark it as shown so it's supressed on next route changes
		if (!hasShownWarningInitially) {
			hasShownWarningInitially = true;
		}
	}, []);

	const data = new Date();

	const updatedDate = data.toLocaleDateString("pt-BR", {
		month: "long",
		year: "numeric",
	});

	const formattedDate = updatedDate.charAt(0).toUpperCase() + updatedDate.slice(1);

	const ano = data.getFullYear();

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col font-sans">
			{/* Barra de Aviso Governamental */}
			{isWarningVisible && (
				<div
					id="infoWarning"
					className="infoWarning bg-gray-100 py-2 border-b border-gray-100 animate-in fade-in slide-in-from-top duration-300">
					<p className="text-[10px] md:text-xs text-gray-500 text-center px-4 leading-tight">
						Auto Defesa - Recursos de Trânsito é uma plataforma de tecnologia privada (SaaS) e não
						possui vínculo com o DETRAN ou órgãos governamentais.
					</p>
				</div>
			)}

			{/* Header Responsivo */}
			<header className="bg-white border-b border-gray-200 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						{/* Logo Area and Guest Indicator */}
						<div className="flex items-center gap-3 md:gap-5">
							<div id="navbarLogo" className="flex items-center gap-1 sm:gap-2">
								<button
									onClick={() => setIsWarningVisible(!isWarningVisible)}
									className="text-gray-400 hover:text-blue-600 transition-colors px-1.5 py-1 flex flex-col items-center justify-center rounded-lg hover:bg-gray-50 group/toggle"
									title={isWarningVisible ? "Esconder aviso legal" : "Mostrar aviso legal"}>
									<div className="transition-transform duration-300">
										{isWarningVisible ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
									</div>
									<Info size={10} className="-mt-0.5 opacity-70 group-hover/toggle:opacity-100" />
								</button>

								<Link to="/" className="flex items-center gap-2 group">
									<img
										src="/fullIcon.png"
										alt="Auto Defesa Logo"
										className="h-8 w-8 object-contain rounded-lg group-hover:opacity-90 transition-opacity"
									/>
									<span className="font-bold text-xl text-gray-900 tracking-tight">
										Auto<span className="text-blue-600">Defesa</span>
									</span>
								</Link>
							</div>

							{!currentUser && guestCredits > 0 && (
								<Link
									to="/upload"
									className="flex items-center gap-1.5 bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-full shadow-sm transition-colors animate-in fade-in duration-300"
									title={`Você tem ${guestCredits} crédito(s) vinculado(s) ao email ${guestEmail}`}>
									<Coins size={14} className="text-green-600 fill-current animate-pulse" />
									<span className="text-xs font-bold text-green-700">
										{guestCredits}
									</span>
								</Link>
							)}
						</div>

						{/* Desktop Navigation */}
						<nav className="hidden min-[1000px]:flex items-center gap-6">
							{!isHome && (
								<Link
									to="/"
									className="text-gray-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-2">
									Início
								</Link>
							)}

							<Link
								to="/how-it-works"
								className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
								Como Funciona
							</Link>

							<Link
								to="/about"
								className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
								Sobre
							</Link>

							<Link
								to="/pricing"
								className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
								Preços
							</Link>

							{/* Utilidades Dropdown */}
							<div className="relative group h-16 flex items-center">
								<button className="text-gray-600 group-hover:text-blue-600 font-medium transition-colors flex items-center gap-1">
									Utilidades
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>
								<div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 hidden group-hover:block p-3 animate-in fade-in slide-in-from-top-2">
									<div className="px-4 py-2 mb-2">
										<Link
											to="/tools"
											className="text-xs font-bold text-gray-600 uppercase tracking-widest hover:text-blue-600 transition-colors">
											1. Ferramentas
										</Link>
										<div className="grid grid-cols-1 gap-1 mt-2">
											<Link
												to="/calculadora-pontos"
												className="block px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
												Calculadora de Pontos
											</Link>
											<Link
												to="/calculadora-prescricao"
												className="block px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
												Calculadora de Prescrição
											</Link>
											<Link
												to="/tools"
												className="block px-3 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg">
												Todas as Ferramentas
											</Link>
										</div>
									</div>

									<div className="h-px bg-gray-100 my-2"></div>

									<div className="px-4 py-2 mb-2">
										<Link
											to="/guia"
											className="text-xs font-bold text-gray-600 uppercase tracking-widest hover:text-blue-600 transition-colors">
											2. Artigos e Guias
										</Link>
										<div className="grid grid-cols-1 gap-1 mt-2">
											<Link
												to="/artigo/lei-seca"
												className="block px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
												Lei Seca
											</Link>
											<Link
												to="/artigo/faixa-exclusiva"
												className="block px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
												Faixa Exclusiva
											</Link>
											<Link
												to="/artigo/excesso-velocidade"
												className="block px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
												Excesso de Velocidade
											</Link>
											<Link
												to="/guia"
												className="block px-3 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg">
												Ver Todos os Artigos
											</Link>
										</div>
									</div>

									<div className="h-px bg-gray-100 my-2"></div>

									<div className="px-4 py-2">
										<Link
											to="/recursos"
											className="text-xs font-bold text-gray-600 uppercase tracking-widest hover:text-blue-600 transition-colors">
											3. Recursos Úteis
										</Link>
										<div className="grid grid-cols-1 gap-1 mt-2">
											<Link
												to="/recorrer/lei-seca"
												className="block px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
												Recurso Lei Seca
											</Link>
											<Link
												to="/recorrer/faixa-exclusiva"
												className="block px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
												Transitar em Faixa Exclusiva
											</Link>
											<Link
												to="/recorrer/ultrapassagem-indevida"
												className="block px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
												Ultrapassagem Indevida
											</Link>
											<Link
												to="/recursos"
												className="block px-3 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg">
												Outras Infrações
											</Link>
										</div>
									</div>
								</div>
							</div>

							<Link
								to="/help"
								className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
								Ajuda
							</Link>

							<div className="h-6 w-px bg-gray-200 mx-2"></div>

							{currentUser ? (
								<div className="flex items-center gap-4">
									<Link
										to="/profile"
										className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group">
										<div className="bg-gray-100 p-1.5 rounded-full group-hover:bg-blue-50 transition-colors">
											<User size={18} />
										</div>
										<span className="text-sm font-medium truncate max-w-[150px]">
											{currentUser.displayName || currentUser.email}
										</span>
									</Link>
								</div>
							) : (
								<div className="flex items-center gap-4">
									<Link
										to="/login"
										className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
										Entrar
									</Link>
									<Link
										to="/register"
										className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
										Criar conta
									</Link>
								</div>
							)}
						</nav>

						{/* Mobile Menu Button */}
						<div className="min-[1000px]:hidden flex items-center">
							<button
								onClick={() => setIsMenuOpen(!isMenuOpen)}
								className="text-gray-600 hover:text-blue-600 p-2"
								aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}>
								{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
							</button>
						</div>
					</div>
				</div>

				{/* Mobile Menu Overlay */}
				{isMenuOpen && (
					<div className="min-[1000px]:hidden bg-white border-b border-gray-200 absolute w-full left-0 top-16 z-40 shadow-lg animate-in slide-in-from-top-2">
						<div className="px-4 py-4 space-y-2 text-center">
							{!isHome && (
								<Link
									to="/"
									onClick={() => setIsMenuOpen(false)}
									className="block text-gray-600 hover:text-blue-600 font-medium py-3 border-b border-gray-100">
									Início
								</Link>
							)}

							<Link
								to="/how-it-works"
								onClick={() => setIsMenuOpen(false)}
								className="block text-gray-600 hover:text-blue-600 font-medium py-3 border-b border-gray-100">
								Como Funciona
							</Link>

							<Link
								to="/about"
								onClick={() => setIsMenuOpen(false)}
								className="block text-gray-600 hover:text-blue-600 font-medium py-3 border-b border-gray-100">
								Sobre Nós
							</Link>

							{/* Utilidades Mobile Dropdown */}
							<div className="border-b border-gray-100">
								<button
									onClick={() => setIsUtilitiesOpen(!isUtilitiesOpen)}
									className="w-full text-gray-600 hover:text-blue-600 font-medium py-3 flex items-center justify-center gap-2">
									Utilidades
									<svg
										className={`w-4 h-4 transition-transform ${isUtilitiesOpen ? "rotate-180" : ""}`}
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>
								{isUtilitiesOpen && (
									<div className="bg-gray-50 py-2 space-y-1 animate-in fade-in slide-in-from-top-1">
										<Link
											to="/tools"
											onClick={() => setIsMenuOpen(false)}
											className="block text-gray-600 hover:text-blue-600 py-2 text-sm">
											Ferramentas
										</Link>
										<Link
											to="/guia"
											onClick={() => setIsMenuOpen(false)}
											className="block text-gray-600 hover:text-blue-600 py-2 text-sm">
											Artigos
										</Link>
										<Link
											to="/recursos"
											onClick={() => setIsMenuOpen(false)}
											className="block text-gray-600 hover:text-blue-600 py-2 text-sm">
											Recursos Úteis
										</Link>
									</div>
								)}
							</div>

							<Link
								to="/pricing"
								onClick={() => setIsMenuOpen(false)}
								className="block text-gray-600 hover:text-blue-600 font-medium py-3 border-b border-gray-100">
								Preços
							</Link>

							<Link
								to="/help"
								onClick={() => setIsMenuOpen(false)}
								className="block text-gray-600 hover:text-blue-600 font-medium py-3 border-b border-gray-100">
								Ajuda
							</Link>

							{currentUser ? (
								<>
									<Link
										to="/profile"
										onClick={() => setIsMenuOpen(false)}
										className="flex items-center justify-center gap-2 text-gray-600 font-medium py-2">
										<User size={18} /> Minha Conta (
										{currentUser.displayName?.split(" ")[0] || "Perfil"})
									</Link>
								</>
							) : (
								<div className="flex flex-col items-center gap-3 pt-2">
									<Link
										to="/login"
										onClick={() => setIsMenuOpen(false)}
										className="w-8/12 text-center text-gray-600 border border-gray-300 font-bold py-3 rounded-xl hover:bg-gray-50">
										Entrar
									</Link>
									<Link
										to="/register"
										onClick={() => setIsMenuOpen(false)}
										className="w-8/12 text-center bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">
										Criar Conta
									</Link>
								</div>
							)}
						</div>
					</div>
				)}
			</header>

			{/* Verification Banner */}
			<VerificationBanner />

			{/* Main Content Area */}
			<main className="flex-1 w-full max-w-8xl mx-auto px-0 py-0">
				{children}
				<footer className="border-t border-gray-100 pb-5 mt-1 flex flex-col items-center">
					<div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-gray-600 mb-6 pt-5">
						<Link to="/about" className="hover:text-blue-600 hover:underline">
							Sobre Nós
						</Link>
						<Link to="/terms" className="hover:text-blue-600 hover:underline">
							Termos de Uso
						</Link>
						<Link to="/privacy" className="hover:text-blue-600 hover:underline">
							Privacidade
						</Link>
					</div>

					<p className="text-[10px] md:text-xs text-gray-500 max-w-4xl mx-4 text-center mb-2 leading-relaxed">
						<strong>Aviso Legal:</strong> O Auto Defesa - Recursos de Trânsito é um assistente
						jurídico automatizado desenvolvido pela iniciativa privada. Não representamos o DETRAN,
						CONTRAN ou qualquer órgão público. O uso da plataforma serve para auxiliar na elaboração
						de defesas administrativas com base na lei (CTB), mas não garante o deferimento dos
						recursos, que depende da análise dos órgãos julgadores. Seus dados são processados de
						acordo com a LGPD e nossa Política de Privacidade.
					</p>

					<p className="text-sm text-gray-400 mt-4 text-center">
						Desenvolvido por RCM Software Studio | Contato:{" "}
						<a href="mailto:suporte@meuautodefesa.com.br" className="hover:text-blue-600 underline">
							suporte@meuautodefesa.com.br
						</a>
					</p>

					<p className="text-sm text-gray-400 mt-1 text-center">
						&copy; {ano} Auto Defesa Recursos. Todos os direitos reservados.
					</p>
					<p className="text-sm text-gray-400"></p>
				</footer>
			</main>

			{/* Floating Guest Credits Indicator */}
			{!currentUser && guestCredits > 0 && showGuestCredits && (
				<div className="flex w-full justify-center">
					<Link
						id="creditModalTemp"
						to="/upload"
						className="fixed bottom-6 md:right-6 z-50 flex align-middle items-center gap-3 bg-white border-2 border-green-500 p-4 rounded-3xl shadow-2xl hover:scale-105 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 group">
						<div className="flex flex-col gap-1 pr-2">
							<span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">
								Créditos disponíveis:
							</span>
							<div className="flex justify-around mx-auto gap-5 items-center">
								<Coins size={20} className="text-green-600" />
								<span id="guestCreditsInfo" className="text-xl font-black text-gray-900">
									{guestCredits}
								</span>
							</div>
						</div>
					</Link>
				</div>
			)}

			<CookieBanner />
		</div>
	);
};

export default MainLayout;
