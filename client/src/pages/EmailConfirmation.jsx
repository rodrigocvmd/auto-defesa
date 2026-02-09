import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { CheckCircle, User, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { applyActionCode } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function EmailConfirmation() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { currentUser } = useAuth();
	const [status, setStatus] = useState("verifying"); // verifying, success, error
	const [message, setMessage] = useState("Processando verificação...");

	// O código de ação (oobCode) é passado pelo Firebase se handleCodeInApp = true
	// Mas no nosso fluxo atual (handleCodeInApp = false), o Firebase já processou e redirecionou.
	// Porém, se mudarmos a estratégia para "custom handler", receberemos o 'oobCode'.
	// Vou implementar suporte híbrido:
	// 1. Se vier com 'oobCode', processamos manualmente (experiência perfeita).
	// 2. Se não vier (redirecionamento simples), assumimos sucesso se o usuário clicou no link.

	useEffect(() => {
		const oobCode = searchParams.get("oobCode");
		const mode = searchParams.get("mode"); // verifyEmail, resetPassword, etc.

		// Fallback de segurança: Se por algum erro de configuração o link de reset de senha
		// estiver apontando para cá, redirecionamos para a página correta.
		if (mode === "resetPassword" && oobCode) {
			navigate(`/reset-password?oobCode=${oobCode}`);
			return;
		}

		if (oobCode && (mode === "verifyEmail" || mode === "verifyAndChangeEmail")) {
			// Modo Manual (Custom Handler)
			applyActionCode(auth, oobCode)
				.then(() => {
					setStatus("success");
					setMessage("Seu email foi confirmado com sucesso!");
					if (currentUser) currentUser.reload();
				})
				.catch((error) => {
					console.error(error);
					setStatus("error");
					setMessage("O link de verificação é inválido ou expirou.");
				});
		} else {
			// Modo Redirecionamento (Firebase já verificou)
			// Simplesmente mostramos a mensagem de sucesso pois o usuário chegou aqui vindo do email.
			setStatus("success");
			setMessage("Seu email foi confirmado com sucesso!");
			if (currentUser) currentUser.reload();
		}
	}, [searchParams, currentUser]);

	return (
		<MainLayout>
			<div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
				<div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md w-full text-center animate-in fade-in zoom-in duration-300">
					{status === "verifying" && (
						<>
							<Loader2 size={64} className="text-blue-600 animate-spin mx-auto mb-6" />
							<h1 className="text-2xl font-bold text-gray-900 mb-2">Verificando...</h1>
							<p className="text-gray-600">{message}</p>
						</>
					)}

					{status === "success" && (
						<>
							<div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
								<CheckCircle size={40} strokeWidth={3} />
							</div>
							<h1 className="text-2xl font-bold text-gray-900 mb-4">Email Confirmado!</h1>
							<p className="text-gray-600 mb-8 leading-relaxed">
								Sua conta está segura e verificada. Você já pode aproveitar todos os recursos da
								Auto Defesa e, se quiser, redefinir uma senha na sua página de perfil.
							</p>
							<Link
								to="/profile"
								className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200 transform hover:-translate-y-1 flex items-center justify-center gap-2">
								<User size={20} />
								Ir para Meu Perfil
							</Link>
						</>
					)}

					{status === "error" && (
						<>
							<div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
								<div className="text-3xl font-bold">!</div>
							</div>
							<h1 className="text-2xl font-bold text-gray-900 mb-4">Erro na Verificação</h1>
							<p className="text-gray-600 mb-8">{message}</p>
							<Link
								to="/profile"
								className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl transition-all">
								Voltar ao Perfil
							</Link>
						</>
					)}
				</div>
			</div>
		</MainLayout>
	);
}
