import React from "react";
import { FileWarning, Gavel, Scale, ArrowLeft, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PhaseSelectionStep = ({ setFormData, setShowHelpModal }) => {
	const navigate = useNavigate();

	return (
		<div className="max-w-4xl mx-4 md:mx-auto py-10">
			<header className="mb-12 text-center">
				<button
					onClick={() => navigate("/upload")}
					className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors">
					<ArrowLeft size={20} className="mr-1" /> Voltar
				</button>
				<h1 className="text-3xl font-bold text-gray-900 mb-4">Qual fase da defesa?</h1>
				<p className="text-gray-600">
					A IA não conseguiu identificar a fase automaticamente ou você optou por alterar.
				</p>
			</header>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
				<button
					onClick={() => {
						setFormData((prev) => ({ ...prev, defenseType: "previa" }));
						navigate("/upload/form");
					}}
					className="bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-yellow-400 transition-all text-left group hover:shadow-md h-full flex flex-col">
					<div className="bg-yellow-100 w-12 h-12 rounded-xl flex items-center justify-center text-yellow-600 mb-4 group-hover:scale-110 transition-transform">
						<FileWarning size={24} />
					</div>
					<h3 className="font-bold text-lg text-gray-800 mb-2">Defesa Prévia</h3>
					<p className="text-sm text-gray-600 leading-relaxed">
						Recebi a <strong>Notificação de Autuação</strong> (sem código de barras). Quero apontar
						erros formais antes da penalidade.
					</p>
				</button>
				<button
					onClick={() => {
						setFormData((prev) => ({ ...prev, defenseType: "jari" }));
						navigate("/upload/form");
					}}
					className="bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-blue-500 transition-all text-left group hover:shadow-md h-full flex flex-col">
					<div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
						<Gavel size={24} />
					</div>
					<h3 className="font-bold text-lg text-gray-800 mb-2">Recurso JARI</h3>
					<p className="text-sm text-gray-600 leading-relaxed">
						Recebi a <strong>Notificação de Penalidade</strong> (com boleto/valor). Quero contestar
						o mérito e cancelar a multa.
					</p>
				</button>
				<button
					onClick={() => {
						setFormData((prev) => ({ ...prev, defenseType: "cetran" }));
						navigate("/upload/form");
					}}
					className="bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-purple-500 transition-all text-left group hover:shadow-md h-full flex flex-col">
					<div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
						<Scale size={24} />
					</div>
					<h3 className="font-bold text-lg text-gray-800 mb-2">CETRAN</h3>
					<p className="text-sm text-gray-600 leading-relaxed">
						Meu recurso à JARI foi <strong>negado/indeferido</strong>. Quero recorrer à última
						instância administrativa.
					</p>
				</button>
			</div>

			<div className="text-center">
				<button
					onClick={() => setShowHelpModal(true)}
					className="text-blue-600 font-bold flex items-center gap-2 mx-auto hover:underline">
					<HelpCircle size={20} /> Preciso de ajuda para identificar
				</button>
			</div>
		</div>
	);
};
