import React, { useState } from "react";
import { UploadCloud, File, X, AlertTriangle, FileText, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

export const UploadStep = ({
	file,
	setFile,
	error,
	setError,
	loading,
	handleUploadAndExtract,
	resetDefense,
}) => {
	const { currentUser } = useAuth();
	const navigate = useNavigate();
	const [isDragging, setIsDragging] = useState(false);

	const processFile = (selectedFile) => {
		if (!selectedFile) return;
		const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
		if (!validTypes.includes(selectedFile.type)) {
			setError("Formato inválido. Envie apenas JPG, PNG ou PDF.");
			return;
		}
		if (selectedFile.size > 4 * 1024 * 1024) {
			setError("Arquivo muito grande. Máximo 4MB.");
			return;
		}
		setFile(selectedFile);
		setError(null);
	};

	const handleFileChange = (e) => {
		if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
	};
	const handleDragOver = (e) => {
		e.preventDefault();
		setIsDragging(true);
	};
	const handleDragLeave = (e) => {
		e.preventDefault();
		setIsDragging(false);
	};
	const handleDrop = (e) => {
		e.preventDefault();
		setIsDragging(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
	};
	const handleRemove = () => {
		setFile(null);
		setError(null);
	};

	const handleManualEntry = () => {
		resetDefense();
		navigate("/upload/phaseSelection");
	};

	return (
		<div className="max-w-3xl mx-auto pt-5 pb-10">
			<div className="mb-8 text-center">
				<Link
					to="/"
					className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-5 transition-colors">
					<ArrowLeft size={20} className="mr-1" /> Início
				</Link>
				<h1 className="text-3xl font-bold text-gray-900">Análise de Documento</h1>
				<p className="text-gray-500 mt-2 mb-8">
					Envie a foto da <strong>Notificação de Autuação</strong>, <strong>Multa/Boleto</strong> ou
					da <strong>Decisão que negou</strong> seu recurso anterior.
					<br />A IA identificará a fase e preencherá os dados automaticamente.
				</p>
			</div>
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
				<div className="p-6 md:p-8">
					{error && (
						<div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-700 items-start">
							<AlertTriangle className="shrink-0" />
							<p>{error}</p>
						</div>
					)}
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleUploadAndExtract();
						}}
						className="space-y-6">
						<div
							className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer min-h-[220px] relative ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50"} ${file ? "border-blue-500 bg-blue-50/30" : ""}`}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}>
							{!file ? (
								<label className="w-full h-full absolute inset-0 flex flex-col items-center justify-center cursor-pointer z-10">
									<div className="bg-white p-4 rounded-full shadow-sm mb-4">
										<UploadCloud size={40} className="text-blue-600" />
									</div>
									<span className="font-semibold text-lg text-gray-700">
										Clique ou arraste aqui
									</span>
									<input
										type="file"
										className="hidden"
										accept="image/*,application/pdf"
										onChange={handleFileChange}
									/>
								</label>
							) : (
								<div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md flex items-center gap-4 animate-in fade-in zoom-in duration-300 z-20">
									<div className="bg-blue-100 p-3 rounded-lg">
										<File size={32} className="text-blue-600" />
									</div>
									<div className="flex-1 min-w-0 text-left">
										<p className="font-semibold text-gray-800 truncate">{file.name}</p>
									</div>
									<button
										type="button"
										onClick={handleRemove}
										className="text-gray-600 hover:text-red-500 transition-colors p-2">
										<X size={20} />
									</button>
								</div>
							)}
						</div>
						<div className="flex flex-col items-center gap-6 pt-4 border-t border-gray-100">
							<button
								type="submit"
								disabled={!file || loading || (currentUser && !currentUser.emailVerified)}
								title={
									currentUser && !currentUser.emailVerified
										? "Confirme seu email para utilizar"
										: ""
								}
								className={`px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all w-full md:w-auto ${file && !loading && (!currentUser || currentUser.emailVerified) ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}>
								{loading ? (
									<>
										<Loader2 className="animate-spin inline mr-2" /> Lendo Documento...
									</>
								) : (
									"Analisar com IA"
								)}
							</button>

							<div className="text-center">
								<p className="text-gray-500 text-sm mb-1">
									Não tem o arquivo ou imagem da infração?
								</p>
								{currentUser && !currentUser.emailVerified ? (
									<button
										disabled
										className="text-gray-600 font-bold flex text-sm items-center justify-center gap-1 mx-auto cursor-not-allowed"
										title="Confirme seu email para utilizar">
										<FileText size={14} /> Inserir dados manualmente
									</button>
								) : (
									<button
										onClick={handleManualEntry}
										className="text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center justify-center gap-1 mx-auto bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
										<FileText size={16} /> Inserir dados manualmente
									</button>
								)}
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};
