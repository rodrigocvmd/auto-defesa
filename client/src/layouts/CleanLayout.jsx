import React from "react";
import { Link } from "react-router-dom";

const CleanLayout = ({ children }) => {
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col font-sans">
			{/* Header Minimalista - Apenas Logo Centralizado */}
			<header className="bg-white border-b border-gray-100 py-4 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 flex justify-center">
					<Link to="/" className="flex items-center gap-2 group">
						<img
							src="/fullIcon.png"
							alt="Auto Defesa Logo"
							className="h-10 w-10 object-contain rounded-lg"
						/>
						<span className="font-bold text-2xl text-gray-900 tracking-tight">
							Auto<span className="text-blue-600">Defesa</span>
						</span>
					</Link>
				</div>
			</header>

			{/* Main Content Area */}
			<main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
				{children}
			</main>

			{/* Rodapé Minimalista */}
			<footer className="py-8 bg-white border-t border-gray-100 text-center">
				<p className="text-sm text-gray-400">
					&copy; {new Date().getFullYear()} Auto Defesa Recursos. Todos os direitos reservados.
				</p>
			</footer>
		</div>
	);
};

export default CleanLayout;
