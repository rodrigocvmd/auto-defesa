import React, { useState } from "react";
import { UploadCloud, File, X, AlertTriangle, FileText, Loader2, Lock } from "lucide-react";
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
		<div className="max-w-3xl mx-auto pt-5 pb-1">
			<div className="docUploadInfo mb-5 text-center relative md:mx-5">
				<h1 className="text-2xl font-bold text-gray-700 mb-4">Análise de Documento</h1>
				<p className="text-gray-600 mt-2 mb-4 mx-2 md:mx-5">
					Envie a foto ou arquivo da <strong>Notificação de Autuação</strong>,{" "}
					<strong>Multa/Boleto</strong> ou da <strong>Decisão que negou</strong> seu recurso
					anterior. A IA <strong>identificará a fase</strong> e preencherá os dados{" "}
					<strong>automaticamente</strong>.
				</p>
				<p className="text-gray-600 mt-2 mb-4 mx-10">Não tem o arquivo ou imagem da infração?</p>
				<div className="text-center">
					<button
						onClick={handleManualEntry}
						className="text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center justify-center gap-1 mx-auto bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
						<FileText size={16} /> Inserir dados manualmente
					</button>
				</div>
			</div>
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
				<div className="generalUploadBox p-6 md:p-8">
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
										Clique aqui ou arraste o arquivo
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
								disabled={!file || loading}
								className={`px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all w-full md:w-auto ${file && !loading ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}>
								{loading ? (
									<>
										<Loader2 className="animate-spin inline mr-2" /> Lendo Documento...
									</>
								) : (
									"Analisar com IA"
								)}
							</button>
						</div>
					</form>

					<div className="mt-8 flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
						<Lock className="lockerIcon text-gray-400 shrink-0" size={18} />
						<p className="lockerInfo text-xs text-gray-500 leading-relaxed">
							Seus documentos são processados de forma criptografada apenas para a extração dos
							dados da infração e geração da defesa. Não guardamos ou compartilhamos suas informações com
							terceiros.
						</p>
					</div>
				</div>
			</div>
			<div className="mt-8 text-center">
				<Link
					to="/"
					className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium">
					<ArrowLeft size={20} className="mr-1" /> Voltar para o Início
				</Link>
			</div>
		</div>
	);
};
