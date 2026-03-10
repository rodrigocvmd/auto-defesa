import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield, User, Menu, X, BookOpen, ChevronDown, ChevronUp, Info } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import VerificationBanner from "../components/VerificationBanner";
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
						Auto Defesa é uma plataforma de tecnologia privada (SaaS) e não possui vínculo com o
						DETRAN ou órgãos governamentais.
					</p>
				</div>
			)}

			{/* Header Responsivo */}
			<header className="bg-white border-b border-gray-200 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						{/* Logo Area com Toggle */}
						<div className="flex items-center gap-1 sm:gap-2">
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
								<div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
									<Shield size={24} className="text-white" />
								</div>
								<span className="font-bold text-xl text-gray-900 tracking-tight">
									Auto<span className="text-blue-600">Defesa</span>
								</span>
							</Link>
						</div>

						{/* Desktop Navigation */}
						<nav className="hidden min-[900px]:flex items-center gap-6">
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
						<div className="min-[900px]:hidden flex items-center">
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
					<div className="min-[900px]:hidden bg-white border-b border-gray-200 absolute w-full left-0 top-16 z-40 shadow-lg animate-in slide-in-from-top-2">
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
								<div className="flex flex-col gap-3 pt-2">
									<Link
										to="/login"
										onClick={() => setIsMenuOpen(false)}
										className="w-full text-center text-gray-600 border border-gray-300 font-bold py-3 rounded-xl hover:bg-gray-50">
										Entrar
									</Link>
									<Link
										to="/register"
										onClick={() => setIsMenuOpen(false)}
										className="w-full text-center bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">
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
				<footer className="border-t border-gray-100 py-6 mt-2 flex flex-col items-center">
					<p className="text-md text-gray-600 mb-4">
						Brasília/DF |{" "}
						<a href="mailto:suporte@meuatodefesa.com.br" className="py-2 px-1">
							suporte@meuatodefesa.com.br
						</a>{" "}
					</p>
					<div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-md text-gray-600 mb-6">
						<Link to="/about" className="hover:underline py-2 px-1">
							Sobre Nós
						</Link>
						<Link to="/terms" className="hover:underline py-2 px-1">
							Termos de Uso
						</Link>
						<Link to="/privacy" className="hover:underline py-2 px-1">
							Privacidade
						</Link>
					</div>

					<p className="text-xs text-gray-600 max-w-4xl mx-3 text-center mb-1 leading-relaxed">
						<strong>Aviso Legal:</strong> O Auto Defesa AI é um assistente jurídico automatizado
						desenvolvido pela iniciativa privada. Não representamos o DETRAN, CONTRAN ou qualquer
						órgão público. O uso da plataforma serve para auxiliar na elaboração de defesas
						administrativas com base na lei (CTB), mas não garante o deferimento dos recursos, que
						depende da análise dos órgãos julgadores. Seus dados são processados de acordo com a
						LGPD e nossa Política de Privacidade.
					</p>

					<p className="text-xs text-gray-600 mt-4">
						&copy; {ano} AutoDefesa Software. Todos os direitos reservados.
					</p>
				</footer>
			</main>
			<CookieBanner />
		</div>
	);
};

export default MainLayout;
