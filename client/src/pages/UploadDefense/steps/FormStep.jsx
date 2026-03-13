import React, { useState } from "react";
import {
	ArrowLeft,
	Info,
	PenTool,
	MapPin,
	Search,
	Gauge,
	Loader2,
	CheckCircle,
	Upload,
	Lock,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { LoginPromptModal } from "../components/modals/LoginPromptModal";
import { HardBlockModal } from "../components/modals/HardBlockModal";
import { DivergenceWarningModal } from "../components/modals/DivergenceWarningModal";
import { CodeNotFoundModal } from "../components/modals/CodeNotFoundModal";
import { TestInfoModal } from "../components/modals/TestInfoModal";

export const FormStep = ({
	formData,
	setFormData,
	loading,
	errors,
	setErrors,
	handleChange,
	handleBlur,
	searchingCode,
	handleSearchCode,
	handlePreAnalysis,
	showLimitModal,
	setShowLimitModal,
	showLoginPrompt,
	setShowLoginPrompt,
	showHardBlockModal,
	setShowHardBlockModal,
	hardBlockInfo,
	showDivergenceModal,
	setShowDivergenceModal,
	analysisData,
	hasTested,
	setShowTestModal,
	showTestModal,
	confirmTestMode,
	clearTestData,
	handleReturnToRealData,
	isTestMode,
	file,
}) => {
	const navigate = useNavigate();
	const [isManualInfraction, setIsManualInfraction] = useState(false);
	const [showCodeNotFoundModal, setShowCodeNotFoundModal] = useState(false);
	const [consent, setConsent] = useState(false);

	// Wrapper for handleSearchCode to handle UI state locally
	const onSearchCode = async () => {
		const found = await handleSearchCode();
		if (!found) {
			setShowCodeNotFoundModal(true);
		} else {
			setIsManualInfraction(false);
		}
	};

	return (
		<div className="max-w-5xl mx-5 md:mx-auto py-8">
			{showLoginPrompt && (
				<LoginPromptModal
					onClose={() => setShowLoginPrompt(false)}
					formData={formData}
					source="upload"
				/>
			)}
			{showHardBlockModal && (
				<HardBlockModal
					hardBlockInfo={hardBlockInfo}
					onClose={() => setShowHardBlockModal(false)}
				/>
			)}
			{showDivergenceModal && (
				<DivergenceWarningModal
					onClose={() => setShowDivergenceModal(false)}
					analysisData={analysisData}
				/>
			)}
			{showCodeNotFoundModal && (
				<CodeNotFoundModal
					onClose={() => setShowCodeNotFoundModal(false)}
					onManualEntry={() => setIsManualInfraction(true)}
					setFormData={setFormData}
				/>
			)}
			{showTestModal && (
				<TestInfoModal onClose={() => setShowTestModal(false)} onConfirm={confirmTestMode} />
			)}

			<header className="mb-8">
				<button
					onClick={() => navigate("/upload")}
					className="text-gray-600 hover:text-blue-600 flex items-center mb-4 transition-colors font-medium">
					<ArrowLeft size={20} className="mr-1" /> Voltar
				</button>
				<h1 className="text-3xl font-bold text-gray-900">Revise os Dados</h1>
				<p className="text-gray-600">
					Nossa IA leu seu documento. Verifique e complete as informações abaixo.
				</p>
				<div className="flex items-center gap-2 mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800 max-w-2xl">
					<Info size={18} className="shrink-0" />
					<p>
						Os dados solicitados abaixo são necessários para a análise técnica da sua infração.
					</p>
				</div>
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 gap-4">
					<div className="text-sm text-gray-500 font-medium">* Campos obrigatórios</div>
					<div className="flex items-center gap-2">
						{!isTestMode && !file && (
							<button
								type="button"
								onClick={() => setShowTestModal(true)}
								className="text-blue-600 bg-blue-50 px-4 py-2 rounded-lg font-bold hover:bg-blue-100 transition-colors text-sm flex items-center gap-2">
								<PenTool size={14} /> Preencher Dados de Teste
							</button>
						)}
						{isTestMode && (
							<div className="flex flex-wrap gap-2">
								<button
									type="button"
									onClick={() => navigate("/upload")}
									className="text-blue-600 bg-blue-50 px-4 py-2 rounded-lg font-bold hover:bg-blue-100 transition-colors text-sm flex items-center gap-2">
									<Upload size={14} /> Extrair dados da minha multa
								</button>
								<button
									type="button"
									onClick={clearTestData}
									className="text-red-600 bg-red-50 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition-colors text-sm flex items-center gap-2">
									<PenTool size={14} /> Remover Dados de Teste
								</button>
							</div>
						)}
					</div>
				</div>
			</header>

			<form
				onSubmit={handlePreAnalysis}
				className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
				{loading && (
					<div className="fixed inset-0 bg-white/80 z-[100] flex flex-col items-center justify-center p-4 text-center">
						<Loader2 size={60} className="text-blue-600 animate-spin mb-4" />
						<h2 className="text-2xl font-bold text-gray-800 mb-2">Processando Análise...</h2>
						<div className="flex items-start gap-3 text-gray-700">
							<CheckCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
							<p className="text-gray-600 max-w-md font-bold">
								Analisando os dados para definir a viabilidade do recurso e possíveis teses a serem
								aplicadas. Aguarde...
							</p>
						</div>
					</div>
				)}

				<section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
					<div className="flex items-center gap-2 border-b pb-4">
						<MapPin className="text-blue-600" />
						<h3 className="text-xl font-bold text-gray-800">1. Infração</h3>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-10 gap-5">
						{/* Linha 1: AIT, Cód, Desd, Amparo */}
						<div className="md:col-span-3">
							<div className="flex gap-2">
								<div className="flex-1">
									<label className="label-form">
										Cód. Infração <span className="text-red-500">*</span>
									</label>
									<input
										name="infractionCode"
										value={formData.infractionCode}
										onChange={handleChange}
										onBlur={handleBlur}
										className={`input-form w-full ${errors.infractionCode ? "border-red-500" : ""}`}
										required
									/>
								</div>
								<div className="w-16">
									<label className="label-form">Desd.</label>
									<input
										name="infractionSplit"
										value={formData.infractionSplit}
										onChange={handleChange}
										onBlur={handleBlur}
										className="input-form w-full text-center"
										placeholder="0"
									/>
								</div>
								<div className="mt-auto pb-1">
									<button
										type="button"
										onClick={onSearchCode}
										className="bg-blue-100 text-blue-600 p-2.5 rounded-xl hover:bg-blue-200 transition-colors h-[42px] w-[42px] flex items-center justify-center"
										title="Buscar Código">
										{searchingCode ? (
											<Loader2 className="animate-spin" size={20} />
										) : (
											<Search size={20} />
										)}
									</button>
								</div>
							</div>
							{errors.infractionCode && (
								<p className="text-red-500 text-xs mt-1">{errors.infractionCode}</p>
							)}
						</div>
						<div className="md:col-span-2">
							<label className="label-form">Amparo Legal</label>
							<input
								name="article"
								value={formData.article}
								onChange={handleChange}
								readOnly={!isManualInfraction}
								className={`input-form ${!isManualInfraction ? "bg-gray-50 cursor-not-allowed" : "bg-white border-yellow-400"}`}
								placeholder={
									isManualInfraction ? "Digite o Artigo (ex: Art. 218, I, CTB)" : "Preencha o Cód."
								}
							/>
						</div>

						<div className="md:col-span-2">
							<label className="label-form">
								AIT (Nº do Auto) <span className="text-red-500">*</span>
							</label>
							<input
								name="aitNumber"
								value={formData.aitNumber}
								onChange={handleChange}
								onBlur={handleBlur}
								className={`input-form ${errors.aitNumber ? "border-red-500" : ""}`}
								required
							/>
							{errors.aitNumber && <p className="text-red-500 text-xs mt-1">{errors.aitNumber}</p>}
						</div>
						{/* Linha 1: Órgão, Data, Hora */}
						<div className="md:col-span-3">
							<label className="label-form">
								Órgão Autuador <span className="text-red-500">*</span>
							</label>
							<input
								name="issuingBody"
								value={formData.issuingBody}
								onChange={handleChange}
								onBlur={handleBlur}
								className={`input-form ${errors.issuingBody ? "border-red-500" : ""}`}
								required
							/>
							{errors.issuingBody && (
								<p className="text-red-500 text-xs mt-1">{errors.issuingBody}</p>
							)}
						</div>
						{/* Linha 4: Local */}
						<div className="md:col-span-6">
							<label className="label-form">
								Local <span className="text-red-500">*</span>
							</label>
							<input
								name="location"
								value={formData.location}
								onChange={handleChange}
								onBlur={handleBlur}
								className={`input-form ${errors.location ? "border-red-500" : ""}`}
								required
							/>
							{errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
						</div>

						<div className="md:col-span-2">
							<label className="label-form">
								Data <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								name="date"
								value={formData.date}
								onChange={handleChange}
								onBlur={handleBlur}
								className={`input-form ${errors.date ? "border-red-500" : ""}`}
								placeholder="DD/MM/AAAA"
								maxLength={10}
								required
							/>
							{errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
						</div>
						<div className="md:col-span-2">
							<label className="label-form">
								Horário <span className="text-red-500">*</span>
							</label>
							<input
								name="time"
								value={formData.time}
								onChange={handleChange}
								onBlur={handleBlur}
								className={`input-form ${errors.time ? "border-red-500" : ""}`}
								placeholder="HH:MM"
								maxLength={5}
								required
							/>
							{errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
						</div>

						{/* Linha 2: Descrição */}
						<div className="md:col-span-10">
							<label className="label-form">Descrição da Infração</label>
							<input
								name="infractionDescription"
								value={formData.infractionDescription || ""}
								onChange={handleChange}
								readOnly={!isManualInfraction}
								className={`input-form ${!isManualInfraction ? "bg-gray-50 text-gray-600 cursor-not-allowed" : "bg-white border-yellow-400"}`}
								placeholder={
									isManualInfraction ? "Digite a descrição da infração" : "Preencha o Cód. Infração"
								}
							/>
						</div>
					</div>
				</section>
				<section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
					<div className="flex items-center gap-2 border-b pb-4">
						<Gauge className="text-blue-600" />
						<h3 className="text-xl font-bold text-gray-800">2. Argumentação</h3>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<div>
							<label className="label-form">
								Nº Equipamento <span className="text-red-500">*</span>
							</label>
							<div className="flex flex-col gap-2">
								<input
									name="equipmentNumber"
									value={formData.equipmentNumber}
									onChange={handleChange}
									onBlur={handleBlur}
									className={`input-form ${errors.equipmentNumber ? "border-red-500" : ""} ${formData.equipmentNumber === "Não disponível" ? "bg-gray-100 text-gray-600" : ""}`}
									placeholder="Ex: 12345678"
									disabled={formData.equipmentNumber === "Não disponível"}
								/>
								{errors.equipmentNumber && (
									<p className="text-red-500 text-xs mt-1">{errors.equipmentNumber}</p>
								)}
								<label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
									<input
										type="checkbox"
										checked={formData.equipmentNumber === "Não disponível"}
										onChange={(e) => {
											setFormData((prev) => ({
												...prev,
												equipmentNumber: e.target.checked ? "Não disponível" : "",
											}));
											if (errors.equipmentNumber) {
												setErrors((prev) => ({ ...prev, equipmentNumber: null }));
											}
										}}
										className="rounded text-blue-600 focus:ring-blue-500"
									/>
									Não disponível
								</label>
							</div>
						</div>
						<div>
							<label className="label-form">
								Aferição <span className="text-red-500">*</span>
							</label>
							<div className="flex flex-col gap-2">
								<input
									name="lastCalibration"
									value={formData.lastCalibration}
									onChange={handleChange}
									onBlur={handleBlur}
									className={`input-form ${errors.lastCalibration ? "border-red-500" : ""} ${formData.lastCalibration === "Não disponível" ? "bg-gray-100 text-gray-600" : ""}`}
									placeholder="Ex: 10/10/2023"
									disabled={formData.lastCalibration === "Não disponível"}
								/>
								{errors.lastCalibration && (
									<p className="text-red-500 text-xs mt-1">{errors.lastCalibration}</p>
								)}
								<label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
									<input
										type="checkbox"
										checked={formData.lastCalibration === "Não disponível"}
										onChange={(e) => {
											setFormData((prev) => ({
												...prev,
												lastCalibration: e.target.checked ? "Não disponível" : "",
											}));
											if (errors.lastCalibration) {
												setErrors((prev) => ({ ...prev, lastCalibration: null }));
											}
										}}
										className="rounded text-blue-600 focus:ring-blue-500"
									/>
									Não disponível
								</label>
							</div>
						</div>
						<div className="md:col-span-2">
							<label className="label-form text-blue-900 font-bold mb-2">
								Relato <span className="text-red-500">*</span>
							</label>
							<textarea
								name="description"
								value={formData.description}
								onChange={handleChange}
								onBlur={handleBlur}
								rows={6}
								className={`input-form resize-none ${errors.description ? "border-red-500" : ""}`}
								placeholder="Descreva com o máximo de detalhes possível os acontecimentos, fatos e informações que considere úteis para a possível nulidade da multa. Quanto mais detalhes, melhor a IA poderá argumentar a seu favor. Ex: 'O sinal estava encoberto por uma árvore', 'O agente não preencheu o campo observações', 'O local da infração não confere com a foto', etc."
								required
							/>
							{errors.description && (
								<p className="text-red-500 text-xs mt-1">{errors.description}</p>
							)}
						</div>{" "}
					</div>
				</section>
				<div className="flex flex-col items-center gap-4 py-8">
					<div className="w-full max-w-xl mb-4">
						<label className="flex items-start gap-3 cursor-pointer group">
							<input
								type="checkbox"
								required
								checked={consent}
								onChange={(e) => setConsent(e.target.checked)}
								className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<span className="text-sm text-gray-600 leading-tight">
								Declaro que li e concordo com os{" "}
								<Link to="/terms" className="text-blue-600 hover:underline">
									Termos de Uso
								</Link>{" "}
								e{" "}
								<Link to="/privacy" className="text-blue-600 hover:underline">
									Política de Privacidade
								</Link>
								, e autorizo o processamento dos dados estritamente para a análise e geração da
								defesa.
							</span>
						</label>
					</div>

					<button
						type="submit"
						className="w-full max-w-xl bg-blue-600 text-white text-2xl font-black py-6 rounded-3xl shadow-2xl hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
						disabled={!consent}>
						Analisar Viabilidade (Grátis)
					</button>

					<div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
						<Lock size={14} className="text-green-500" />
						<span>Ambiente Seguro e Dados Criptografados de Ponta a Ponta</span>
					</div>

					<div className="max-w-xl text-center space-y-2 mt-4">
						<p className="text-gray-600 text-sm">
							Nenhum crédito será cobrado nesta etapa.
						</p>
						<p className="text-[10px] md:text-xs text-gray-500 leading-relaxed">
							Seus dados são utilizados exclusivamente para a redação da sua defesa
							administrativa e não são compartilhados com terceiros.
						</p>
					</div>
				</div>
			</form>
			<style
				dangerouslySetInnerHTML={{
					__html: `.input-form { width: 100%; padding: 0.875rem; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.75rem; } .label-form { font-size: 0.875rem; font-weight: 500; color: #374151; display: block; margin-bottom: 0.25rem; }`,
				}}
			/>
		</div>
	);
};
