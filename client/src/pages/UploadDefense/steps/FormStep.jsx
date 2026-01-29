import React, { useState } from "react";
import { ArrowLeft, Info, PenTool, User, Car, MapPin, Search, Gauge, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LimitExceededModal } from "../components/modals/LimitExceededModal";
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
	loadingCep,
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
	isTestMode,
	file,
}) => {
	const navigate = useNavigate();
	const [isManualInfraction, setIsManualInfraction] = useState(false);
	const [showCodeNotFoundModal, setShowCodeNotFoundModal] = useState(false);

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
		<div className="max-w-5xl mx-auto py-8">
			{showLimitModal && (
				<LimitExceededModal
					onClose={() => setShowLimitModal(false)}
					onProceed={(e) => handlePreAnalysis(e, true)}
				/>
			)}
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
					className="text-gray-500 hover:text-blue-600 flex items-center mb-4 transition-colors font-medium">
					<ArrowLeft size={20} className="mr-1" /> Voltar
				</button>
				<h1 className="text-3xl font-bold text-gray-900">Revise os Dados</h1>
				<p className="text-gray-600">
					Nossa IA leu seu documento. Verifique e complete as informações abaixo.
				</p>
				<div className="flex items-center gap-2 mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800 max-w-2xl">
					<Info size={18} className="shrink-0" />
					<p>
						Os dados solicitados abaixo são obrigatórios conforme a{" "}
						<strong>Resolução CONTRAN nº 900/2022</strong>.
					</p>
				</div>
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 gap-4">
					<div className="text-sm text-red-600 font-medium">* Campos obrigatórios</div>
					{!hasTested && !file && (
						<button
							type="button"
							onClick={() => setShowTestModal(true)}
							className="text-blue-600 bg-blue-50 px-4 py-2 rounded-lg font-bold hover:bg-blue-100 transition-colors text-sm flex items-center gap-2">
							<PenTool size={14} /> Preencher Dados de Teste
						</button>
					)}
				</div>
			</header>

			<form
				onSubmit={handlePreAnalysis}
				className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
				{loading && (
					<div className="fixed inset-0 bg-white/80 z-[100] flex flex-col items-center justify-center p-4 text-center">
						<Loader2 size={60} className="text-blue-600 animate-spin mb-4" />
						<h2 className="text-2xl font-bold text-gray-800 mb-2">Processando Análise...</h2>
						<p className="text-gray-600 max-w-md font-bold">
							Analisando os dados para definir a viabilidade do recurso e possíveis teses a serem
							aplicadas...
						</p>
					</div>
				)}

				<section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
					<div className="flex items-center gap-2 border-b pb-4">
						<User className="text-blue-600" />
						<h3 className="text-xl font-bold text-gray-800">1. Qualificação</h3>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-10 gap-5">
						{/* Linha 1 */}
						<div className="md:col-span-5">
							<label className="label-form">
								Nome Completo <span className="text-red-500">*</span>
							</label>
							<input
								name="name"
								value={formData.name}
								onChange={handleChange}
								onBlur={handleBlur}
								className={`input-form ${errors.name ? "border-red-500" : ""}`}
								required
							/>
							{errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
						</div>
						<div className="md:col-span-5">
							<label className="label-form">
								CPF <span className="text-red-500">*</span>
							</label>
							<input
								name="cpf"
								value={formData.cpf}
								onChange={handleChange}
								onBlur={handleBlur}
								className={`input-form ${errors.cpf ? "border-red-500" : ""}`}
								required
							/>
							{errors.cpf && <p className="text-red-500 text-xs mt-1">{errors.cpf}</p>}
						</div>

						{/* Linha 2 */}
						<div className="md:col-span-2">
							<label className="label-form">
								RG <span className="text-red-500">*</span>
							</label>
							<input
								name="rg"
								value={formData.rg}
								onChange={handleChange}
								onBlur={handleBlur}
								className={`input-form ${errors.rg ? "border-red-500" : ""}`}
								required
							/>
							{errors.rg && <p className="text-red-500 text-xs mt-1">{errors.rg}</p>}
						</div>
						<div className="md:col-span-2">
							<label className="label-form">
								UF do RG <span className="text-red-500">*</span>
							</label>
							<select
								name="rgIssuer"
								value={formData.rgIssuer}
								onChange={handleChange}
								onBlur={handleBlur}
								className={`input-form ${errors.rgIssuer ? "border-red-500" : ""}`}
								required>
								<option value="">Selecione...</option>
								{[
									"AC",
									"AL",
									"AP",
									"AM",
									"BA",
									"CE",
									"DF",
									"ES",
									"GO",
									"MA",
									"MT",
									"MS",
									"MG",
									"PA",
									"PB",
									"PR",
									"PE",
									"PI",
									"RJ",
									"RN",
									"RS",
									"RO",
									"RR",
									"SC",
									"SP",
									"SE",
									"TO",
								].map((uf) => (
									<option key={uf} value={uf}>
										{uf}
									</option>
								))}
							</select>
							{errors.rgIssuer && <p className="text-red-500 text-xs mt-1">{errors.rgIssuer}</p>}
						</div>
						<div className="md:col-span-3">
							<label className="label-form">
								Como prefere ser tratado? <span className="text-red-500">*</span>
							</label>
							<select
								name="preferredTreatment"
								value={formData.preferredTreatment || ""}
								onChange={handleChange}
								onBlur={handleBlur}
								className={`input-form ${errors.preferredTreatment ? "border-red-500" : ""}`}
								required>
								<option value="">Selecione...</option>
								<option value="O Recorrente">O Recorrente (Masculino)</option>
								<option value="A Recorrente">A Recorrente (Feminino)</option>
								<option value="Tratamento neutro">Tratamento neutro</option>
							</select>
							{errors.preferredTreatment && (
								<p className="text-red-500 text-xs mt-1">{errors.preferredTreatment}</p>
							)}
						</div>

						{/* Linha 3 */}
						<div className="md:col-span-3">
							<label className="label-form">
								CNH
							</label>
							<input
								name="cnh"
								value={formData.cnh}
								onChange={handleChange}
								onBlur={handleBlur}
								className={`input-form ${errors.cnh ? "border-red-500" : ""}`}
							/>
							{errors.cnh && <p className="text-red-500 text-xs mt-1">{errors.cnh}</p>}
						</div>

						{/* Linha 4 */}
						<div className="md:col-span-5">
							<label className="label-form">
								Telefone (para notificações do processo) <span className="text-red-500">*</span>
							</label>
							<input
								name="phone"
								value={formData.phone}
								onChange={handleChange}
								onBlur={handleBlur}
								className={`input-form ${errors.phone ? "border-red-500" : ""}`}
								required
							/>
							{errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
						</div>
						<div className="md:col-span-5">
							<label className="label-form">
								E-mail (para notificações do processo) <span className="text-red-500">*</span>
							</label>
							<input
								name="email"
								value={formData.email}
								onChange={handleChange}
								onBlur={handleBlur}
								type="email"
								className={`input-form ${errors.email ? "border-red-500" : ""}`}
								required
							/>
							{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
						</div>
					</div>

					{/* Endereço Mantido como estava, mas ajustando classes se necessário para compatibilidade */}
					<div className="pt-4 border-t border-gray-100 mt-2">
						<h4 className="text-sm font-bold text-gray-500 mb-4 uppercase">Endereço Completo</h4>
						<div className="grid grid-cols-1 md:grid-cols-4 gap-5">
							<div>
								<label className="label-form">
									CEP <span className="text-red-500">*</span>
								</label>
								<div className="relative">
									<input
										name="zipCode"
										value={formData.zipCode}
										onChange={handleChange}
										onBlur={handleBlur}
										className={`input-form ${errors.zipCode ? "border-red-500" : ""}`}
										required
									/>
									{loadingCep && (
										<Loader2
											className="animate-spin absolute right-3 top-3 text-blue-600"
											size={20}
										/>
									)}
								</div>
								{errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
							</div>
							<div className="md:col-span-3">
								<label className="label-form">
									Logradouro <span className="text-red-500">*</span>
								</label>
								<input
									name="address"
									value={formData.address}
									onChange={handleChange}
									onBlur={handleBlur}
									className={`input-form ${errors.address ? "border-red-500" : ""}`}
									required
								/>
								{errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
							</div>
							<div>
								<label className="label-form">
									Número <span className="text-red-500">*</span>
								</label>
								<input
									name="addressNumber"
									value={formData.addressNumber}
									onChange={handleChange}
									onBlur={handleBlur}
									className={`input-form ${errors.addressNumber ? "border-red-500" : ""}`}
									required
								/>
								{errors.addressNumber && (
									<p className="text-red-500 text-xs mt-1">{errors.addressNumber}</p>
								)}
							</div>
							<div>
								<label className="label-form">Complemento</label>
								<input
									name="addressComplement"
									value={formData.addressComplement}
									onChange={handleChange}
									onBlur={handleBlur}
									className="input-form"
								/>
							</div>
							<div className="md:col-span-2">
								<label className="label-form">
									Bairro <span className="text-red-500">*</span>
								</label>
								<input
									name="neighborhood"
									value={formData.neighborhood}
									onChange={handleChange}
									onBlur={handleBlur}
									className={`input-form ${errors.neighborhood ? "border-red-500" : ""}`}
									required
								/>
								{errors.neighborhood && (
									<p className="text-red-500 text-xs mt-1">{errors.neighborhood}</p>
								)}
							</div>
							<div className="md:col-span-2">
								<label className="label-form">
									Cidade <span className="text-red-500">*</span>
								</label>
								<input
									name="city"
									value={formData.city}
									onChange={handleChange}
									onBlur={handleBlur}
									className={`input-form ${errors.city ? "border-red-500" : ""}`}
									required
								/>
								{errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
							</div>
							<div className="md:col-span-2">
								<label className="label-form">
									UF <span className="text-red-500">*</span>
								</label>
								<select
									name="state"
									value={formData.state}
									onChange={handleChange}
									onBlur={handleBlur}
									className={`input-form ${errors.state ? "border-red-500" : ""}`}
									required>
									<option value="">Selecione...</option>
									{[
										"AC",
										"AL",
										"AP",
										"AM",
										"BA",
										"CE",
										"DF",
										"ES",
										"GO",
										"MA",
										"MT",
										"MS",
										"MG",
										"PA",
										"PB",
										"PR",
										"PE",
										"PI",
										"RJ",
										"RN",
										"RS",
										"RO",
										"RR",
										"SC",
										"SP",
										"SE",
										"TO",
									].map((uf) => (
										<option key={uf} value={uf}>
											{uf}
										</option>
									))}
								</select>
								{errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
							</div>
						</div>
					</div>
				</section>
				<section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
					<div className="flex items-center gap-2 border-b pb-4">
						<Car className="text-blue-600" />
						<h3 className="text-xl font-bold text-gray-800">2. Veículo</h3>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
						<div>
							<label className="label-form">
								Placa <span className="text-red-500">*</span>
							</label>
							<input
								name="plate"
								value={formData.plate}
								onChange={handleChange}
								onBlur={handleBlur}
								className={`input-form ${errors.plate ? "border-red-500" : ""}`}
								required
							/>
							{errors.plate && <p className="text-red-500 text-xs mt-1">{errors.plate}</p>}
						</div>
						<div>
							<label className="label-form">
								UF da Placa <span className="text-red-500">*</span>
							</label>
							<select
								name="plateUF"
								value={formData.plateUF}
								onChange={handleChange}
								onBlur={handleBlur}
								className={`input-form ${errors.plateUF ? "border-red-500" : ""}`}
								required>
								<option value="">Selecione...</option>
								{[
									"AC",
									"AL",
									"AP",
									"AM",
									"BA",
									"CE",
									"DF",
									"ES",
									"GO",
									"MA",
									"MT",
									"MS",
									"MG",
									"PA",
									"PB",
									"PR",
									"PE",
									"PI",
									"RJ",
									"RN",
									"RS",
									"RO",
									"RR",
									"SC",
									"SP",
									"SE",
									"TO",
								].map((uf) => (
									<option key={uf} value={uf}>
										{uf}
									</option>
								))}
							</select>
							{errors.plateUF && <p className="text-red-500 text-xs mt-1">{errors.plateUF}</p>}
						</div>
						<div>
							<label className="label-form">
								Marca/Modelo <span className="text-red-500">*</span>
							</label>
							<input
								name="vehicleModel"
								value={formData.vehicleModel}
								onChange={handleChange}
								onBlur={handleBlur}
								className={`input-form ${errors.vehicleModel ? "border-red-500" : ""}`}
								required
							/>
							{errors.vehicleModel && (
								<p className="text-red-500 text-xs mt-1">{errors.vehicleModel}</p>
							)}
						</div>
					</div>
				</section>
				<section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
					<div className="flex items-center gap-2 border-b pb-4">
						<MapPin className="text-blue-600" />
						<h3 className="text-xl font-bold text-gray-800">3. Infração</h3>
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
									isManualInfraction
										? "Digite o Artigo (ex: Art. 218, I, CTB)"
										: "Preencha o Cód."
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
									isManualInfraction
										? "Digite a descrição da infração"
										: "Preencha o Cód. Infração"
								}
							/>
						</div>

						
					</div>
				</section>
				<section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
					<div className="flex items-center gap-2 border-b pb-4">
						<Gauge className="text-blue-600" />
						<h3 className="text-xl font-bold text-gray-800">4. Argumentação</h3>
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
									className={`input-form ${errors.equipmentNumber ? "border-red-500" : ""} ${formData.equipmentNumber === "Não disponível" ? "bg-gray-100 text-gray-500" : ""}`}
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
									className={`input-form ${errors.lastCalibration ? "border-red-500" : ""} ${formData.lastCalibration === "Não disponível" ? "bg-gray-100 text-gray-500" : ""}`}
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
				<section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
					<div className="flex items-center gap-2 border-b pb-4">
						<PenTool className="text-blue-600" />
						<h3 className="text-xl font-bold text-gray-800">5. Finalização</h3>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<div>
							<label className="label-form">
								Cidade Assinatura <span className="text-red-500">*</span>
							</label>
							<input
								name="signCity"
								value={formData.signCity}
								onChange={handleChange}
								onBlur={handleBlur}
								className={`input-form ${errors.signCity ? "border-red-500" : ""}`}
								required
							/>
							{errors.signCity && <p className="text-red-500 text-xs mt-1">{errors.signCity}</p>}
						</div>
						<div>
							<label className="label-form">
								Data Assinatura <span className="text-red-500">*</span>
							</label>
							<input
								name="signDate"
								value={formData.signDate}
								onChange={handleChange}
								onBlur={handleBlur}
								className={`input-form ${errors.signDate ? "border-red-500" : ""}`}
								required
							/>
							{errors.signDate && <p className="text-red-500 text-xs mt-1">{errors.signDate}</p>}
						</div>
					</div>
				</section>
				<div className="flex flex-col items-center gap-4 py-8">
					<button
						type="submit"
						className="w-full max-w-xl bg-blue-600 text-white text-2xl font-black py-6 rounded-3xl shadow-2xl hover:bg-blue-700 active:scale-95 transition-all">
						Analisar Caso (Grátis)
					</button>
					<p className="text-center text-gray-400 text-sm mt-3">
						Nenhum crédito será cobrado nesta etapa.
					</p>
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
