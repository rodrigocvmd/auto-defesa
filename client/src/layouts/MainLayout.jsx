import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield, User, LogOut, Menu, X, BookOpen } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import VerificationBanner from "../components/VerificationBanner";

const MainLayout = ({ children }) => {
	const location = useLocation();
	const navigate = useNavigate();
	const { currentUser, logout } = useAuth();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const isHome = location.pathname === "/";

	const data = new Date();

	const updatedDate = data.toLocaleDateString("pt-BR", {
		month: "long",
		year: "numeric",
	});

	const formattedDate = updatedDate.charAt(0).toUpperCase() + updatedDate.slice(1);

	async function handleLogout() {
		try {
			await logout();
			navigate("/login");
		} catch (error) {
			console.error("Erro ao sair", error);
		}
	}

	const ano = data.getFullYear();

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col font-sans">
			{/* Header Responsivo */}
			<header className="bg-white border-b border-gray-200 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						{/* Logo Area */}
						<Link to="/" className="flex items-center gap-2 group">
							<div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
								<Shield size={24} className="text-white" />
							</div>
							<span className="font-bold text-xl text-gray-900 tracking-tight">
								Auto<span className="text-blue-600">Defesa</span>
							</span>
						</Link>

						{/* Desktop Navigation */}
						<nav className="hidden md:flex items-center gap-6">
							{!isHome && (
								<Link
									to="/"
									className="text-gray-500 hover:text-blue-600 font-medium transition-colors flex items-center gap-2">
									Início
								</Link>
							)}

							<Link
								to="/how-it-works"
								className="text-gray-500 hover:text-blue-600 font-medium transition-colors">
								Como Funciona
							</Link>

							<Link
								to="/pricing"
								className="text-gray-500 hover:text-blue-600 font-medium transition-colors">
								Preços
							</Link>

							<Link
								to="/guia"
								className="text-gray-500 hover:text-blue-600 font-medium transition-colors">
								Artigos
							</Link>

							{/* Recursos Úteis Dropdown */}
							<div className="relative group h-16 flex items-center">
								<Link
									to="/recursos"
									className="text-gray-500 hover:text-blue-600 font-medium transition-colors flex items-center gap-1">
									Recursos Úteis
								</Link>
								<div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 hidden group-hover:block p-2 animate-in fade-in slide-in-from-top-2">
									<Link
										to="/recorrer/lei-seca"
										className="block px-4 py-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
										Lei Seca
									</Link>
									<Link
										to="/recorrer/recusa-bafometro"
										className="block px-4 py-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
										Recusa ao Bafômetro
									</Link>
									<Link
										to="/recorrer/excesso-velocidade"
										className="block px-4 py-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
										Excesso de Velocidade
									</Link>
									<Link
										to="/recorrer/celular-direcao"
										className="block px-4 py-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
										Uso de Celular
									</Link>
									<Link
										to="/recorrer/cnh-vencida"
										className="block px-4 py-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
										CNH Vencida
									</Link>
									<div className="h-px bg-gray-100 my-1"></div>
									<Link
										to="/recursos"
										className="block px-4 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg text-center">
										Outras Infrações
									</Link>
								</div>
							</div>

							<Link
								to="/help"
								className="text-gray-500 hover:text-blue-600 font-medium transition-colors">
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
									<div className="h-4 w-px bg-gray-300"></div>
									<button
										onClick={handleLogout}
										className="text-gray-500 hover:text-red-600 font-medium transition-colors flex items-center gap-2 text-sm"
										title="Sair">
										<LogOut size={18} />
									</button>
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
						<div className="md:hidden flex items-center">
							<button
								onClick={() => setIsMenuOpen(!isMenuOpen)}
								className="text-gray-500 hover:text-blue-600 p-2">
								{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
							</button>
						</div>
					</div>
				</div>

				{/* Mobile Menu Overlay */}
				{isMenuOpen && (
					<div className="md:hidden bg-white border-b border-gray-200 absolute w-full left-0 top-16 z-40 shadow-lg animate-in slide-in-from-top-2">
						<div className="px-4 py-4 space-y-4 text-center">
							{!isHome && (
								<Link
									to="/"
									onClick={() => setIsMenuOpen(false)}
									className="block text-gray-600 hover:text-blue-600 font-medium py-2 border-b border-gray-100">
									Início
								</Link>
							)}
							<Link
								to="/guia"
								onClick={() => setIsMenuOpen(false)}
								className="block text-gray-600 hover:text-blue-600 font-medium py-2 border-b border-gray-100">
								Artigos
							</Link>
							<Link
								to="/how-it-works"
								onClick={() => setIsMenuOpen(false)}
								className="block text-gray-600 hover:text-blue-600 font-medium py-2 border-b border-gray-100">
								Como Funciona
							</Link>
							<Link
								to="/pricing"
								onClick={() => setIsMenuOpen(false)}
								className="block text-gray-600 hover:text-blue-600 font-medium py-2 border-b border-gray-100">
								Preços
							</Link>
							<Link
								to="/recursos"
								onClick={() => setIsMenuOpen(false)}
								className="block text-gray-600 hover:text-blue-600 font-medium py-2 border-b border-gray-100">
								Recursos Úteis
							</Link>
							<Link
								to="/help"
								onClick={() => setIsMenuOpen(false)}
								className="block text-gray-600 hover:text-blue-600 font-medium py-2 border-b border-gray-100">
								Ajuda
							</Link>

							{currentUser ? (
								<>
									<Link
										to="/profile"
										onClick={() => setIsMenuOpen(false)}
										className="flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600 font-medium py-2">
										<User size={18} /> Minha Conta (
										{currentUser.displayName?.split(" ")[0] || "Perfil"})
									</Link>
									<button
										onClick={() => {
											handleLogout();
											setIsMenuOpen(false);
										}}
										className="w-full text-red-600 font-medium py-2 flex items-center justify-center gap-2">
										<LogOut size={18} /> Sair
									</button>
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
			<main className="flex-1 w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-1 py-1">
				{children}
				<footer className="border-t border-gray-100 py-6 mt-8 flex flex-col items-center">
					{/* Recursos Úteis */}
					{!location.pathname.startsWith("/upload") && (
						<div className="w-full max-w-4xl mb-8 px-4">
							<h4 className="text-gray-900 font-bold text-md mb-5 text-center">Recursos Úteis</h4>
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center ">
								<Link
									to="/recorrer/lei-seca"
									className="text-gray-500 hover:text-blue-600 text-md transition-colors">
									Recurso à Lei Seca
								</Link>
								<Link
									to="/recorrer/recusa-bafometro"
									className="text-gray-500 hover:text-blue-600 text-md transition-colors">
									Recusa ao Bafômetro
								</Link>
								<Link
									to="/recorrer/excesso-velocidade"
									className="text-gray-500 hover:text-blue-600 text-md transition-colors">
									Excesso de Velocidade
								</Link>
								<Link
									to="/recorrer/celular-direcao"
									className="text-gray-500 hover:text-blue-600 text-md transition-colors">
									Utilização de Celular
								</Link>
								<Link
									to="/recursos"
									className="text-gray-500 hover:text-blue-600 text-md transition-colors">
									Ver Outras Infrações
								</Link>
							</div>
						</div>
					)}

					<p className="text-md text-gray-500 mb-4">
						Brasília/DF |{" "}
						<a className="underline" href="mailto:suporte@meuatodefesa.com.br">
							suporte@meuatodefesa.com.br
						</a>{" "}
					</p>
					<div className="flex justify-center gap-4 text-md text-gray-500 mb-4">
						<Link to="/about" className="hover:underline">
							Sobre Nós
						</Link>
						<Link to="/terms" className="hover:underline">
							Termos de Uso
						</Link>
						<Link to="/privacy" className="hover:underline">
							Privacidade
						</Link>
					</div>

					<p className="text-xs text-gray-400 max-w-3xl text-center mb-1">
						O Auto Defesa é um assistente tecnológico para auxílio na redação de recursos. Não
						substituímos a consultoria de um advogado.
					</p>

					<p className="text-xs text-gray-400 mt-4">
						&copy; {ano} AutoDefesa Software. Todos os direitos reservados.
					</p>
				</footer>
			</main>
		</div>
	);
};

export default MainLayout;
