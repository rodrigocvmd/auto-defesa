import React from "react";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const HardBlockModal = ({ hardBlockInfo, onClose }) => {
	const navigate = useNavigate();
	const timeLeft = hardBlockInfo ? Math.ceil((hardBlockInfo.expiresAt - Date.now()) / 60000) : 0;

	return (
		<div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in">
			<div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative p-8 text-center border-t-4 border-red-600">
				<div className="mb-6 flex justify-center">
					<div className="bg-red-100 p-4 rounded-full">
						<Lock size={40} className="text-red-600" />
					</div>
				</div>
				<h3 className="text-2xl font-black text-gray-900 mb-2">Acesso Temporariamente Bloqueado</h3>
				<p className="text-red-600 font-bold mb-4 bg-red-50 py-2 rounded-lg">
					{hardBlockInfo?.message || "Limite de segurança atingido."}
				</p>
				<p className="text-gray-600 mb-8 leading-relaxed">
					Você excedeu o limite de tentativas e bypass permitidos.
					<br />
					Para garantir a estabilidade do sistema, novas análises estão suspensas por:
					<br />
					<span className="text-3xl font-black text-gray-900 block mt-4">{timeLeft} minutos</span>
					{""} Caso entenda que isso tenha sido um erro ou queira elaborar o recurso final agora,
					entre em contato com nosso pronto{" "}
					<Link className="underline" to="/help">
						suporte
					</Link>
					.
				</p>

				<button
					onClick={() => {
						onClose();
						navigate("/");
					}}
					className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-colors shadow-lg">
					Voltar ao Início
				</button>
			</div>
		</div>
	);
};
