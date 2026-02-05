import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import SEO from "../components/SEO";
import { infractionData } from "../utils/infractionData";
import { ArrowRight, Shield } from "lucide-react";

const AllInfractionsPage = () => {
	const infractions = Object.entries(infractionData);

	return (
		<MainLayout>
			<SEO
				title="Todos os Recursos de Multas | Auto Defesa"
				description="Veja a lista completa de infrações de trânsito que o Auto Defesa atende. Recorra de multas e proteja sua CNH com tecnologia avançada."
			/>
			
			<div className="bg-blue-50 py-16 text-center border-b border-blue-100">
				<div className="max-w-4xl mx-auto px-4">
					<h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">
						Tipos de Infrações Atendidas
					</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Nossa inteligência artificial é treinada para elaborar defesas técnicas para uma ampla variedade de multas de trânsito. Escolha a sua abaixo.
					</p>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 pt-10 pb-1">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{infractions.map(([slug, data]) => (
						<Link
							key={slug}
							to={`/recorrer/${slug}`}
							className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col h-full"
						>
							<div className="mb-6 bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
								<Shield size={24} />
							</div>
							<h2 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
								{data.title}
							</h2>
							<p className="text-gray-600 leading-relaxed mb-6 flex-1">
								{data.description}
							</p>
							<div className="flex items-center text-blue-600 font-bold gap-2">
								Saiba mais <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
							</div>
						</Link>
					))}
				</div>
			</div>
		</MainLayout>
	);
};

export default AllInfractionsPage;
