import React, { useState } from "react";
import { ShieldCheck, Info, Loader2, Download } from "lucide-react";

export const FinalizeModal = ({ onClose, onConfirm, loading }) => {
	const [vData, setVData] = useState({
		idPrimary: "",
		idSecondary: "",
		driverReg: "",
		locZip: "",
		locStreet: "",
		locNum: "",
		locNeighb: "",
		locCity: "",
		locState: "",
	});

	const [vErrors, setVErrors] = useState({});

	const hChange = (e) => {
		const { name, value } = e.target;
		setVData((prev) => ({ ...prev, [name]: value }));
		if (vErrors[name]) setVErrors((prev) => ({ ...prev, [name]: null }));
	};

	const hSubmit = (e) => {
		e.preventDefault();
		onConfirm(vData);
	};

	return (
		<div className="fixed inset-0 bg-black/70 z-[150] flex items-center justify-center p-3 md:p-4 backdrop-blur-md animate-in fade-in duration-300">
			<div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh]">
				<div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

				<div className="p-5 md:p-8 overflow-y-auto">
					<div className="text-center mb-6">
						<div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
							<ShieldCheck size={32} />
						</div>
						<h2 className="text-2xl md:text-3xl font-black text-gray-900">Finalize seu Documento</h2>
						<div className="mt-3 flex items-start gap-2 bg-blue-50 p-4 rounded-xl border border-blue-100 text-left">
							<Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
							<p className="text-xs md:text-sm text-blue-900 leading-relaxed">
								<strong>Privacidade Total:</strong> Para sua segurança, os dados abaixo 
								<strong> não são salvos em nosso sistema</strong>. Eles serão injetados apenas no 
								arquivo PDF gerado agora e descartados imediatamente.
							</p>
						</div>
					</div>

					<form onSubmit={hSubmit} className="space-y-6">
						<div className="space-y-4">
							<h3 className="font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
								<span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
								Dados de Identificação
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-1">
									<label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Nº Documento 1 (ex: CPF)</label>
									<input
										name="idPrimary"
										value={vData.idPrimary}
										onChange={hChange}
										className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
										placeholder="000.000.000-00"
									/>
								</div>
								<div className="space-y-1">
									<label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Nº Documento 2 (ex: RG)</label>
									<input
										name="idSecondary"
										value={vData.idSecondary}
										onChange={hChange}
										className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
										placeholder="00.000.000-0"
									/>
								</div>
								<div className="space-y-1 md:col-span-2">
									<label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Registro de Habilitação (CNH)</label>
									<input
										name="driverReg"
										value={vData.driverReg}
										onChange={hChange}
										className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
										placeholder="Nº de Registro da CNH"
									/>
								</div>
							</div>
						</div>

						<div className="space-y-4">
							<h3 className="font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
								<span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
								Endereço de Correspondência
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-6 gap-4">
								<div className="md:col-span-2 space-y-1">
									<label className="text-xs font-bold text-gray-600 uppercase tracking-wider">CEP</label>
									<input
										name="locZip"
										value={vData.locZip}
										onChange={hChange}
										className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
										placeholder="00000-000"
									/>
								</div>
								<div className="md:col-span-4 space-y-1">
									<label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Logradouro (Rua/Av)</label>
									<input
										name="locStreet"
										value={vData.locStreet}
										onChange={hChange}
										className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
										placeholder="Nome da rua ou avenida"
									/>
								</div>
								<div className="md:col-span-2 space-y-1">
									<label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Número</label>
									<input
										name="locNum"
										value={vData.locNum}
										onChange={hChange}
										className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
										placeholder="Ex: 123"
									/>
								</div>
								<div className="md:col-span-4 space-y-1">
									<label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Bairro</label>
									<input
										name="locNeighb"
										value={vData.locNeighb}
										onChange={hChange}
										className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
										placeholder="Seu bairro"
									/>
								</div>
								<div className="md:col-span-4 space-y-1">
									<label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Cidade</label>
									<input
										name="locCity"
										value={vData.locCity}
										onChange={hChange}
										className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
										placeholder="Sua cidade"
									/>
								</div>
								<div className="md:col-span-2 space-y-1">
									<label className="text-xs font-bold text-gray-600 uppercase tracking-wider">UF</label>
									<input
										name="locState"
										value={vData.locState}
										onChange={hChange}
										maxLength={2}
										className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-center"
										placeholder="SP"
									/>
								</div>
							</div>
						</div>

						<div className="flex flex-col md:flex-row gap-3 pt-4">
							<button
								type="button"
								onClick={onClose}
								className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all order-2 md:order-1"
							>
								Cancelar
							</button>
							<button
								type="submit"
								disabled={loading}
								className="flex-[2] px-6 py-3.5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2 order-1 md:order-2"
							>
								{loading ? (
									<>
										<Loader2 className="animate-spin" size={20} /> Processando...
									</>
								) : (
									<>
										<Download size={20} /> Gerar e Baixar PDF
									</>
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};
