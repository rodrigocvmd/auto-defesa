import React, { useState, useEffect } from "react";
import {
	ArrowLeft,
	User,
	MapPin,
	Car,
	FileText,
	Loader2,
	Lock,
	AlertTriangle,
	Coins,
	Info,
	Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { api } from "../../../services/api";

export const QualificacaoStep = ({
	formData,
	loading,
	errors,
	handleChange,
	handleBlur,
	handleUnlockDefense,
	analysisData,
}) => {
	const navigate = useNavigate();
	const { userData, currentUser } = useAuth();
	
	const [isVerifying, setIsVerifying] = useState(true);
	const [guestCredits, setGuestCredits] = useState(null);
	const [guestEmailCheck, setGuestEmailCheck] = useState("");
	const [checkError, setCheckError] = useState("");

	useEffect(() => {
		const checkAccess = async () => {
			if (currentUser && userData) {
				setIsVerifying(false);
				return;
			}
			
			if (currentUser && !userData) {
			    // Still loading user data
			    return;
			}

			// Guest mode check
			const savedEmail = localStorage.getItem("guestEmail");
			if (savedEmail) {
				const normalizedEmail = savedEmail.trim().toLowerCase();
				try {
					const data = await api.getGuestCredits(normalizedEmail);
					setGuestCredits(data.credits);
					setGuestEmailCheck(normalizedEmail);
				} catch (e) {
					console.error(e);
				}
			}
			setIsVerifying(false);
		};
		checkAccess();
	}, [currentUser, userData]);

	const handleVerifyGuest = async (e) => {
		e.preventDefault();
		const normalizedEmail = (guestEmailCheck || "").trim().toLowerCase();
		if (!normalizedEmail || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
			setCheckError("Email inválido.");
			return;
		}
		setCheckError("");
		setIsVerifying(true);
		try {
			const data = await api.getGuestCredits(normalizedEmail);
			const credits = data.credits;
			setGuestCredits(credits);
			if (credits > 0) {
				localStorage.setItem("guestEmail", normalizedEmail);
				window.dispatchEvent(new Event("guestEmailChanged"));
				setGuestEmailCheck(normalizedEmail);
			} else {
				setCheckError("Nenhum crédito encontrado para este email.");
			}
		} catch (e) {
			setCheckError("Erro ao verificar email.");
		}
		setIsVerifying(false);
	};

	const hasAccess = (userData && userData.credits > 0) || (guestCredits !== null && guestCredits > 0);
	const availableCredits = userData ? userData.credits : (guestCredits || 0);

	if (isVerifying && !hasAccess) {
		return (
			<div className="flex justify-center items-center p-20 min-h-[50vh]">
				<Loader2 className="animate-spin text-blue-600" size={40} />
			</div>
		);
	}

	if (!hasAccess) {
		return (
			<div className="max-w-2xl mx-auto pt-16 pb-10 px-5">
				<div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 text-center relative overflow-hidden">
					<div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
					<Lock size={56} className="mx-auto text-blue-600 mb-6" />
					<h2 className="text-3xl font-black text-gray-900 mb-4">Acesso Protegido</h2>
					<p className="text-gray-600 mb-8 text-lg leading-relaxed">
						Para preencher os dados de qualificação e gerar seu recurso, você precisa ter <strong>créditos disponíveis</strong>.
					</p>

					{!currentUser && (guestCredits === 0 || guestCredits === null) && (
						<div className="bg-blue-50 rounded-2xl p-6 mb-8 text-left border border-blue-100">
							<div className="flex items-start gap-3">
								<Mail className="text-blue-600 shrink-0 mt-1" size={24} />
								<div className="w-full">
									<h4 className="font-bold text-gray-900 mb-1">Comprou como convidado?</h4>
									<p className="text-sm text-gray-600 mb-4">
										Informe o email que você utilizou na hora do pagamento para vincular e usar seus créditos.
									</p>
									<form onSubmit={handleVerifyGuest} className="flex flex-col sm:flex-row gap-3">
										<div className="flex-1 relative">
											<input
												type="email"
												placeholder="Seu email de compra"
												className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
												value={guestEmailCheck}
												onChange={(e) => setGuestEmailCheck(e.target.value)}
												required
											/>
										</div>
										<button
											type="submit"
											disabled={isVerifying}
											className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-all active:scale-95 shrink-0 disabled:opacity-50"
										>
											{isVerifying ? <Loader2 className="animate-spin" size={20} /> : "Verificar"}
										</button>
									</form>
									{checkError && <p className="text-red-500 text-sm mt-2 font-medium">{checkError}</p>}
								</div>
							</div>
						</div>
					)}

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<button
							onClick={() => navigate("/pricing")}
							className="bg-gray-900 text-white font-bold py-4 px-8 rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
						>
							<Coins size={20} />
							Ver Planos e Preços
						</button>
						{!currentUser && (
							<button
								onClick={() => navigate("/login")}
								className="bg-white text-gray-700 font-bold py-4 px-8 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
							>
								<User size={20} />
								Fazer Login
							</button>
						)}
					</div>
					
					<div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-sm text-gray-500">
						<Info size={16} />
						Seus dados estarão seguros após a validação.
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-5xl mx-5 md:mx-auto pt-8 pb-5">
			<header className="mb-5 text-center flex flex-col items-center">
				<button
					onClick={() => navigate("/upload/analysis")}
					className="text-gray-600 hover:text-blue-600 flex items-center mb-4 transition-colors font-medium">
					<ArrowLeft size={20} className="mr-1" /> Voltar para Análise
				</button>
				<h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 mb-2">
					Qualificação do Recorrente
				</h1>
				<p className="text-gray-500 !w-full md:max-w-3xl mt-2">
					Dados já preenchidos foram extraídos do arquivo juntado. Antes de prosseguir,{" "}
					<strong>revise!</strong>
				</p>
				<p className="text-gray-500 max-w-6xl md:max-w-3xl mt-2">
					<strong>Caso os dados do recorrente sejam diversos</strong>, altere conforme necessário.
				</p>
				<div className="flex items-center gap-4 mt-4 py-3 px-3 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800 max-w-5xl md:max-w-5xl text-justify md:text-center">
					<Info size={18} className="shrink-0" />
					<p>
						Os dados solicitados abaixo são necessários para o a validade do seu recurso nos termos
						da <strong>Resolução CONTRAN nº 900/2022</strong> e não são armazenados.
					</p>
				</div>
			</header>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleUnlockDefense();
				}}
				className="space-y-8 bg-white px-3 pt-8 pb-5 md:px-8 rounded-3xl shadow-sm border border-gray-100">
				{loading && (
					<div className="fixed inset-0 bg-white/90 z-[100] flex flex-col items-center justify-center p-4 text-center backdrop-blur-sm animate-in fade-in duration-300">
						<Loader2 size={60} className="text-blue-600 animate-spin mb-4" />
						<h2 className="text-2xl font-black text-gray-900 mb-2">Construindo sua Defesa...</h2>
						<div className="flex flex-col items-center justify-center gap-2 text-gray-700">
							<p className="text-gray-600 max-w-md font-bold leading-relaxed">
								A IA Pro está gerando o recurso com as melhores teses aplicáveis.
							</p>
							<p className="text-gray-600 max-w-md font-bold leading-relaxed">
								A geração pode levar até 1 minuto.
							</p>
						</div>
						<div className="mt-8 flex gap-2">
							<div className="h-1.5 w-24 bg-blue-100 rounded-full overflow-hidden">
								<div className="h-full bg-blue-600 animate-progress"></div>
							</div>
						</div>
						<style dangerouslySetInnerHTML={{
							__html: `
								@keyframes progress {
									0% { width: 0%; }
									100% { width: 100%; }
								}
								.animate-progress {
									animation: progress 2s ease-in-out infinite;
								}
							`
						}} />
					</div>
				)}
				{/* Seção 1: Dados Pessoais */}
				<section className="space-y-6">
					<div className="flex items-center gap-2 border-b pb-4">
						<User className="text-blue-600" />
						<h3 className="text-xl font-bold text-gray-800">1. Dados Pessoais</h3>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-10 gap-5">
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
						<div className="md:col-span-3">
							<label className="label-form">CNH</label>
							<input
								name="cnh"
								value={formData.cnh}
								onChange={handleChange}
								onBlur={handleBlur}
								className={`input-form ${errors.cnh ? "border-red-500" : ""}`}
							/>
							{errors.cnh && <p className="text-red-500 text-xs mt-1">{errors.cnh}</p>}
						</div>
						<div className="md:col-span-5">
							<label className="label-form">
								Telefone <span className="text-red-500">*</span>
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
								Email <span className="text-red-500">*</span>
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
				</section>

				{/* Seção 2: Endereço */}
				<section className="space-y-6">
					<div className="flex items-center gap-2 border-b pb-4">
						<MapPin className="text-blue-600" />
						<h3 className="text-xl font-bold text-gray-800">2. Endereço Completo</h3>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-5">
						<div>
							<label className="label-form">
								CEP <span className="text-red-500">*</span>
							</label>
							<input
								name="zipCode"
								value={formData.zipCode}
								onChange={handleChange}
								onBlur={handleBlur}
								className={`input-form ${errors.zipCode ? "border-red-500" : ""}`}
								required
							/>
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
				</section>

				{/* Seção 3: Veículo */}
				<section className="space-y-6">
					<div className="flex items-center gap-2 border-b pb-4">
						<Car className="text-blue-600" />
						<h3 className="text-xl font-bold text-gray-800">3. Dados do Veículo</h3>
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

				{/* Seção 4: Assinatura */}
				<section className="space-y-6">
					<div className="flex items-center gap-2 border-b pb-4">
						<FileText className="text-blue-600" />
						<h3 className="text-xl font-bold text-gray-800">4. Finalização</h3>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<div>
							<label className="label-form">
								Cidade de Assinatura <span className="text-red-500">*</span>
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
								Data de Assinatura <span className="text-red-500">*</span>
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

				<div className="flex flex-col items-center gap-4 py-5">
					<button
						type="submit"
						disabled={loading}
						className="creditUse w-full max-w-xl bg-blue-600 text-white text-2xl font-black py-5 rounded-3xl shadow-2xl hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 sm:gap-3">
						{loading ? (
							<>
								<Loader2 className="animate-spin" size={24} /> Gerando Defesa...
							</>
						) : (
							<div className="flex flex-col sm:flex-row items-center sm:gap-2">
								<span className="text-xl">Gerar Recurso Oficial</span>
								<span className="text-xl font-bold sm:font-black">(Utiliza 1 Crédito)</span>
							</div>
						)}
					</button>
					<div className="creditAmountInfo mt-4 flex flex-col items-center">
						<span className="text-gray-400 text-sm uppercase font-bold tracking-widest mb-2">
							Seu Saldo Atual
						</span>
						<div className="bg-gray-100 px-4 py-1 rounded-full text-gray-600 font-black text-lg flex items-center gap-2">
							{availableCredits}{" "}
							<span className="text-md font-normal opacity-80">
								{availableCredits <= 1 ? "crédito" : "créditos"}
							</span>
						</div>
					</div>

					<div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
						<Lock size={18} className="text-green-500" />
						<span className="text-center">
							Ambiente Seguro e Dados Criptografados de Ponta a Ponta
						</span>
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
