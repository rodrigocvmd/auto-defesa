import React from "react";
import {
	ArrowLeft,
	User,
	MapPin,
	Car,
	FileText,
	Loader2,
	Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QualificacaoStep = ({
	formData,
	loading,
	errors,
	handleChange,
	handleBlur,
	handleUnlockDefense,
}) => {
	const navigate = useNavigate();

	return (
		<div className="max-w-5xl mx-5 md:mx-auto py-8">
			<header className="mb-8">
				<button
					onClick={() => navigate("/upload/analysis")}
					className="text-gray-600 hover:text-blue-600 flex items-center mb-4 transition-colors font-medium">
					<ArrowLeft size={20} className="mr-1" /> Voltar para Análise
				</button>
				<h1 className="text-3xl font-bold text-gray-900">Qualificação do Recorrente</h1>
				<p className="text-gray-600">
					Estes dados são obrigatórios por lei para a validade jurídica do documento e não são compartilhados.
				</p>
			</header>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleUnlockDefense();
				}}
				className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
				
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
									"AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
									"PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
								].map((uf) => (
									<option key={uf} value={uf}>{uf}</option>
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
								E-mail <span className="text-red-500">*</span>
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
							{errors.addressNumber && <p className="text-red-500 text-xs mt-1">{errors.addressNumber}</p>}
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
							{errors.neighborhood && <p className="text-red-500 text-xs mt-1">{errors.neighborhood}</p>}
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
									"AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
									"PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
								].map((uf) => (
									<option key={uf} value={uf}>{uf}</option>
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
									"AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
									"PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
								].map((uf) => (
									<option key={uf} value={uf}>{uf}</option>
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
							{errors.vehicleModel && <p className="text-red-500 text-xs mt-1">{errors.vehicleModel}</p>}
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

				<div className="flex flex-col items-center gap-4 py-8">
					<button
						type="submit"
						disabled={loading}
						className="w-full max-w-xl bg-blue-600 text-white text-2xl font-black py-6 rounded-3xl shadow-2xl hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3">
						{loading ? (
							<>
								<Loader2 className="animate-spin" size={24} /> Gerando Defesa...
							</>
						) : (
							"Gerar Defesa Oficial (Utiliza 1 Crédito)"
						)}
					</button>

					<div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
						<Lock size={14} className="text-green-500" />
						<span>Ambiente Seguro e Dados Criptografados de Ponta a Ponta</span>
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
