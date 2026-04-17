import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { DownloadSuccessModal } from "./UploadDefense/components/modals/DownloadSuccessModal";
import {
	User,
	FileText,
	Settings,
	Shield,
	Clock,
	Download,
	Car,
	Save,
	Lock,
    LogOut,
	AlertCircle,
	CheckCircle,
	Plus,
	Coins,
	AlertTriangle,
	Trash2,
    Check,
    X,
    Star,
    MessageSquare,
    Mail,
    Loader2,
    Send
} from "lucide-react";
import { updateProfile, updatePassword } from "firebase/auth";
import {
	doc,
	getDoc,
	setDoc,
	collection,
	query,
	where,
	getDocs,
	orderBy,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { api } from "../services/api";
import { formatDefenseToHtml } from "../utils/textToHtml";
import { pdf } from "@react-pdf/renderer";
import DefenseDocument from "../components/DefensePDF";
import { FeedbackModal } from "../components/FeedbackModal";

export default function Profile() {
	const { currentUser, userData, updateUserEmail, deleteUserAccount, checkEmailExists, logout, resendVerificationEmail } = useAuth();
	const navigate = useNavigate();
    const location = useLocation();
	const [activeTab, setActiveTab] = useState("defenses");
	const [loading, setLoading] = useState(false);
	const [pageLoading, setPageLoading] = useState(true);
	const [message, setMessage] = useState({ type: "", content: "" });
	const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
    const [resendingVerification, setResendingVerification] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const [emailStatus, setEmailStatus] = useState({});
	const [selectedDefense, setSelectedDefense] = useState(null);

	// Estados do Formulário de Perfil
	const [displayName, setDisplayName] = useState("");
	const [email, setEmail] = useState("");

	// Estados do Formulário de Senha
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

    // Password strength states
    const [hasMinLength, setHasMinLength] = useState(false);
    const [hasUpperCase, setHasUpperCase] = useState(false);
    const [hasNumber, setHasNumber] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);

	// Estado do Histórico
	const [defenses, setDefenses] = useState([]);
    
    async function handleLogout() {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Erro ao sair", error);
        }
    }

    useEffect(() => {
        if (newPassword) {
            setHasMinLength(newPassword.length >= 6);
            setHasUpperCase(/[A-Z]/.test(newPassword));
            setHasNumber(/[0-9]/.test(newPassword));
            setPasswordsMatch(newPassword === confirmPassword && newPassword !== '');
        } else {
             // Reset validation if password field is cleared
            setHasMinLength(false);
            setHasUpperCase(false);
            setHasNumber(false);
            setPasswordsMatch(false);
        }
    }, [newPassword, confirmPassword]);

    useEffect(() => {
        if (location.state?.downloadStarted) {
            setShowSuccessModal(true);
            // Limpa o state para não reabrir ao atualizar a página
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

	useEffect(() => {
		if (!currentUser) {
			navigate("/login");
			return;
		}

		async function fetchUserData() {
			try {
				// 1. Carregar dados básicos do Auth
				setDisplayName(currentUser.displayName || "");
				setEmail(currentUser.email || "");

				// 2. Carregar dados estendidos do Firestore
				const userDocRef = doc(db, "users", currentUser.uid);
				const userDocSnap = await getDoc(userDocRef);

				// 3. Carregar histórico de defesas
				const defensesRef = collection(db, "defenses");
				const q = query(defensesRef, where("userId", "==", currentUser.uid));

				const querySnapshot = await getDocs(q);
				const defensesList = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));

				// Ordenar no cliente para evitar necessidade de índice composto
				defensesList.sort((a, b) => {
					const dateA = a.createdAt?.seconds || 0;
					const dateB = b.createdAt?.seconds || 0;
					return dateB - dateA; // Decrescente
				});

				setDefenses(defensesList);
			} catch (error) {
				console.error("Erro ao carregar dados:", error);
			} finally {
				setPageLoading(false);
			}
		}

		fetchUserData();
	}, [currentUser, navigate]);

	async function handleUpdateProfile(e) {
		e.preventDefault();

		const nameParts = displayName.trim().split(/\s+/);
		if (nameParts.length < 2 || nameParts.some((part) => part.length < 2)) {
			setMessage({
				type: "error",
				content: "Insira seu nome completo.",
			});
			return;
		}

		setLoading(true);
		setMessage({ type: "", content: "" });

		try {
			let successMsg = "";

			// 1. Atualizar Email (se mudou)
			if (email !== currentUser.email) {
				// Verificação prévia de existência
				const emailStatus = await checkEmailExists(email);
				if (emailStatus.exists) {
					throw new Error("Este email já está em uso por outra conta.");
				}

				try {
					await updateUserEmail(email);
					successMsg += `Email de verificação enviado para ${email}. Verifique a caixa de entrada e SPAM deste NOVO endereço para concluir. `;
				} catch (error) {
					if (error.code === "auth/requires-recent-login") {
						throw new Error("Para alterar o email, faça login novamente por segurança.");
					} else if (error.code === "auth/invalid-email") {
						throw new Error("O email informado é inválido.");
					} else if (error.code === "auth/email-already-in-use") {
						throw new Error("Este email já está em uso por outra conta.");
					}
					throw error;
				}
			}

			// 2. Atualizar Auth Profile (Nome)
			if (currentUser.displayName !== displayName) {
				await updateProfile(currentUser, {
					displayName: displayName,
				});
				if (!successMsg) successMsg = "Perfil atualizado com sucesso!";
			}

			// 3. Atualizar Firestore Profile
			const userDocRef = doc(db, "users", currentUser.uid);
			await setDoc(
				userDocRef,
				{
					email: currentUser.email,
					displayName: displayName,
					updatedAt: new Date(),
				},
				{ merge: true },
			);

			// 4. Se houver nova senha, atualizar
			if (newPassword) {
				if (!passwordsMatch || !hasMinLength || !hasUpperCase || !hasNumber) {
                    throw new Error("A senha não atende aos requisitos de segurança.");
				}
				await updatePassword(currentUser, newPassword);
				successMsg += " Senha alterada com sucesso!";
				setNewPassword("");
				setConfirmPassword("");
			}

			if (!successMsg) successMsg = "Perfil atualizado com sucesso!";
			setMessage({ type: "success", content: successMsg });
		} catch (error) {
			console.error(error);
			setMessage({
				type: "error",
				content: error.message || "Erro ao atualizar dados. Tente novamente.",
			});
		}
		setLoading(false);
	}

	async function handleUpdatePassword(e) {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			return setMessage({ type: "error", content: "As senhas não conferem." });
		}

		setLoading(true);
		setMessage({ type: "", content: "" });

		try {
			await updatePassword(currentUser, newPassword);
			setMessage({ type: "success", content: "Senha alterada com sucesso!" });
			setNewPassword("");
			setConfirmPassword("");
		} catch (error) {
			setMessage({
				type: "error",
				content: "Erro ao alterar senha. Pode ser necessário fazer login novamente.",
			});
		}
		setLoading(false);
	}

	async function handleDeleteAccount() {
		setLoading(true);
		try {
			await deleteUserAccount();
			navigate("/login");
		} catch (error) {
			console.error("Erro ao excluir conta:", error);
			if (error.code === "auth/requires-recent-login") {
				setMessage({
					type: "error",
					content: "Por segurança, faça login novamente para excluir sua conta.",
				});
				setShowDeleteModal(false);
			} else {
				setMessage({
					type: "error",
					content: "Erro ao excluir conta. Tente novamente mais tarde.",
				});
				setShowDeleteModal(false);
			}
		}
		setLoading(false);
	}

	const downloadPDF = async (defense) => {
		if (!defense || !defense.defenseText) {
			alert("Texto da defesa não encontrado.");
			return;
		}

		setLoading(true);

		// Sempre formatamos para garantir que o wrapper HTML/CSS completo seja aplicado,
		// mesmo que o texto já tenha tags parciais (ex: <p>, <h3>) salvas no banco.
		let contentHtml = formatDefenseToHtml(defense.defenseText);
        
        let fileName = defense.fileName;
        if (!fileName) {
             fileName = `Recurso_${defense.licensePlate || "Final"}`;
        }
        if (!fileName.toLowerCase().endsWith(".pdf")) {
            fileName += ".pdf";
        }

		try {
            // Gera o PDF no cliente usando @react-pdf/renderer (mesmo motor do UploadDefense)
			const blob = await pdf(<DefenseDocument content={contentHtml} />).toBlob();
            
            // Download do Blob
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

		} catch (err) {
			console.error("Erro ao gerar PDF:", err);
			alert(`Erro ao baixar o PDF: ${err.message}`);
		} finally {
			setLoading(false);
		}
	};

	const emailPDF = async (defense) => {
		if (!defense || !defense.defenseText) {
			alert("Texto da defesa não encontrado.");
			return false;
		}

		setEmailStatus((prev) => ({ ...prev, [defense.id]: "sending" }));

		let contentHtml = formatDefenseToHtml(defense.defenseText);
        
        let fileName = defense.fileName;
        if (!fileName) {
             fileName = `Recurso_${defense.licensePlate || "Final"}`;
        }
        if (!fileName.toLowerCase().endsWith(".pdf")) {
            fileName += ".pdf";
        }

		try {
			const blob = await pdf(<DefenseDocument content={contentHtml} />).toBlob();
            
            const reader = new FileReader();
            const base64Promise = new Promise((resolve, reject) => {
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
            });
            reader.readAsDataURL(blob);
            const base64data = await base64Promise;

            await api.sendDefensePdfEmail(base64data, fileName);
			setEmailStatus((prev) => ({ ...prev, [defense.id]: "success" }));
			
			setTimeout(() => {
				setEmailStatus((prev) => ({ ...prev, [defense.id]: "idle" }));
			}, 3000);

			return true;
		} catch (err) {
			console.error("Erro ao enviar PDF por email:", err);
			alert(`Erro ao enviar o PDF: ${err.message}`);
			setEmailStatus((prev) => ({ ...prev, [defense.id]: "idle" }));
			return false;
		}
	};

	const handleResendVerification = async () => {
		setResendingVerification(true);
		try {
			await resendVerificationEmail();
			setVerificationSent(true);
		} catch (error) {
			console.error("Erro ao reenviar email de verificação:", error);
			alert("Erro ao reenviar email. Tente novamente mais tarde.");
		} finally {
			setResendingVerification(false);
		}
	};

	return (
		<MainLayout>
			<div className="max-w-4xl mx-auto">
				{/* Header do Perfil */}
				<div id="profileHero" className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mx-2 mt-6 mb-6 flex flex-col md:flex-row items-center gap-6">
					<div className="bg-blue-100 p-6 rounded-full text-blue-600">
						<User size={48} />
					</div>
					<div id="userInfo" className="text-center md:text-left flex-1 flex flex-col items-center md:block">
						<h1 className="text-2xl font-bold text-gray-900">
							{currentUser?.displayName || "Usuário"}
						</h1>
						<p className="text-gray-600 break-all">{currentUser?.email}</p>
						<button
							onClick={handleLogout}
							className="mt-2 text-red-500 hover:text-red-700 font-bold text-sm flex items-center gap-1 transition-colors"
							title="Sair da conta">
							<LogOut size={16} /> Sair da conta
						</button>
						<p className="text-xs text-gray-600 mt-2">
							Membro desde{" "}
							{currentUser?.metadata.creationTime
								? new Date(currentUser.metadata.creationTime).toLocaleDateString("pt-BR")
								: "-"}
						</p>
					</div>

					{/* Créditos do Usuário */}
					<div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex flex-col items-center justify-center min-w-[200px]">
						<div className="flex items-center gap-2 text-blue-600 mb-1">
							<Coins size={20} />
							<span className="text-sm font-bold uppercase tracking-wider">Créditos</span>
						</div>
						<div id="userCreditsInfo" className="text-3xl font-black text-gray-900 mb-2">{userData?.credits || 0}</div>
						<Link
							to="/pricing"
							className="text-xs bg-blue-600 text-white px-4 py-1.5 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-sm">
							Adquirir novos
						</Link>
					</div>
				</div>

				{/* Navegação de Abas */}
				<div className="flex flex-col md:flex-row md:overflow-x-auto gap-2 mb-6 mx-2 pb-2 md:pb-0 justify-center">
					<button
						onClick={() => setActiveTab("defenses")}
						className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors justify-center ${
							activeTab === "defenses"
								? "bg-blue-600 text-white shadow-sm"
								: "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
						}`}>
						<FileText size={18} /> Minhas Defesas
					</button>
					<button
						onClick={() => setActiveTab("data-security")}
						className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors justify-center ${
							activeTab === "data-security"
								? "bg-blue-600 text-white shadow-sm"
								: "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
						}`}>
						<Shield size={18} /> Dados e Segurança
					</button>

					{/* Botão de Avaliação */}
					<div className="relative group flex justify-center">
						<button
							disabled={defenses.length === 0 || userData?.hasGivenFeedback}
							onClick={() => setShowFeedbackModal(true)}
							className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all justify-center border ${
								userData?.hasGivenFeedback
									? "bg-green-50 text-green-600 border-green-200 cursor-default opacity-80"
									: defenses.length === 0
									? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
									: "bg-white text-gray-600 hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-200"
							}`}>
							{userData?.hasGivenFeedback ? (
								<>
									<Check size={18} /> Avaliação realizada
								</>
							) : (
								<>
									<Star size={18} className={defenses.length > 0 ? "text-yellow-500 fill-yellow-500" : ""} /> Avaliar serviço
								</>
							)}
						</button>
						{defenses.length === 0 && !userData?.hasGivenFeedback && (
							<div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-gray-800 text-white text-[10px] p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center">
								Disponível após gerar seu primeiro recurso.
							</div>
						)}
					</div>
				</div>

				{/* Conteúdo das Abas */}
				<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6 mb-8 mx-2">
					{/* Feedback Message */}
					{message.content && (
						<div
							className={`p-4 rounded-lg mb-6 flex items-center gap-2 text-sm ${
								message.type === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
							}`}>
							{message.type === "error" ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
							{message.content}
						</div>
					)}

					{/* ABA: MINHAS DEFESAS */}
					{activeTab === "defenses" && (
						<div>
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-xl font-bold text-gray-900">Histórico de Defesas</h2>
								<Link
									to="/upload"
									className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-medium hover:bg-blue-100 transition-colors">
									<Plus size={16} /> Nova Defesa
								</Link>
							</div>

							{defenses.length > 0 ? (
								<div className="space-y-4">
									{defenses.map((defense) => (
										<div
											key={defense.id}
											className="border border-gray-100 rounded-xl p-4 hover:border-blue-100 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
											<div className="flex items-start gap-4">
												<div className="bg-blue-50 p-3 rounded-lg text-blue-600">
													<Shield size={24} />
												</div>
												<div className="min-w-0 flex-1">
													<h3 className="font-semibold text-gray-900 break-all">
														{defense.fileName ? defense.fileName.replace(/\.pdf$/i, "") : (defense.infractionType || "Infração não especificada")}
													</h3>
													<div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
														<span className="flex items-center gap-1">
															<Car size={14} /> {defense.licensePlate || "N/A"}
														</span>
														<span className="flex items-center gap-1">
															<Clock size={14} />
															{defense.createdAt?.seconds
																? new Date(defense.createdAt.seconds * 1000).toLocaleString(
																		"pt-BR",
																		{
																			day: "2-digit",
																			month: "2-digit",
																			year: "numeric",
																			hour: "2-digit",
																			minute: "2-digit",
																		},
																	)
																: "Data desc."}
														</span>
													</div>
												</div>
											</div>
											<div className="flex items-center gap-3 w-full md:w-auto">
												<span
													className={`px-3 py-1 rounded-full text-xs font-medium ${
														defense.status === "completed"
															? "bg-green-100 text-green-700"
															: "bg-yellow-100 text-yellow-700"
													}`}>
													{defense.status === "completed" ? "Pronto" : "Processando"}
												</span>
												<button
													onClick={() => {
														if (!currentUser?.emailVerified) {
															setShowEmailVerificationModal(true);
															return;
														}
														if (emailStatus[defense.id] !== "sending" && emailStatus[defense.id] !== "success") {
															emailPDF(defense);
														}
													}}
													disabled={emailStatus[defense.id] === "sending" || emailStatus[defense.id] === "success"}
													className={`p-2 transition-colors ${
														!currentUser?.emailVerified 
															? "text-gray-400 cursor-pointer hover:text-gray-500" 
															: emailStatus[defense.id] === "success" 
															? "text-green-600 bg-green-50 rounded-full" 
															: emailStatus[defense.id] === "sending"
															? "text-blue-400"
															: "text-gray-600 hover:text-blue-600"
													}`}
													title={!currentUser?.emailVerified ? "Email não verificado" : "Enviar PDF por Email"}>
													{emailStatus[defense.id] === "success" ? (
														<CheckCircle size={20} />
													) : emailStatus[defense.id] === "sending" ? (
														<Loader2 size={20} className="animate-spin" />
													) : (
														<Mail size={20} />
													)}
												</button>
												<button
													onClick={() => downloadPDF(defense)}
													className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
													title="Baixar PDF">
													<Download size={20} />
												</button>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-12 text-gray-600">
									<FileText size={48} className="mx-auto mb-4 opacity-20" />
									<p className="mb-4">Nenhuma defesa gerada ainda.</p>
									<Link
										to="/upload"
										className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline">
										Criar minha primeira defesa
									</Link>
								</div>
							)}
						</div>
					)}

					{/* ABA: DADOS E SEGURANÇA */}
					{activeTab === "data-security" && (
						<div className="space-y-12">
							<form onSubmit={handleUpdateProfile}>
								<h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
									<Settings size={20} className="text-blue-600" /> Informações Pessoais
								</h2>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Nome Completo
										</label>
										<input
											type="text"
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
											value={displayName}
											onChange={(e) => setDisplayName(e.target.value)}
											placeholder="Como devemos te chamar?"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
										<input
											type="email"
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											placeholder="seu@email.com"
										/>
									</div>
								</div>

								<div className="border-t border-gray-100 pt-8 mt-8">
									<h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
										<Lock size={20} className="text-blue-600" /> Alterar Senha
									</h2>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Nova Senha
											</label>
											<input
												type="password"
												className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
												value={newPassword}
												onChange={(e) => setNewPassword(e.target.value)}
												placeholder="Mínimo 6 caracteres"
											/>
                                            {/* Password Feedback */}
                                            {newPassword && (
                                                <div className="mt-3 space-y-1">
                                                    <p className="text-xs font-medium text-gray-600 mb-1">Sua senha deve ter:</p>
                                                    <div className={`flex items-center gap-2 text-xs ${hasMinLength ? 'text-green-600' : 'text-gray-600'}`}>
                                                        {hasMinLength ? <Check size={12} strokeWidth={3} /> : <div className="w-3 h-3 rounded-full border border-gray-300" />}
                                                        Mínimo de 6 caracteres
                                                    </div>
                                                    <div className={`flex items-center gap-2 text-xs ${hasUpperCase ? 'text-green-600' : 'text-gray-600'}`}>
                                                        {hasUpperCase ? <Check size={12} strokeWidth={3} /> : <div className="w-3 h-3 rounded-full border border-gray-300" />}
                                                        Pelo menos 1 letra maiúscula
                                                    </div>
                                                    <div className={`flex items-center gap-2 text-xs ${hasNumber ? 'text-green-600' : 'text-gray-600'}`}>
                                                        {hasNumber ? <Check size={12} strokeWidth={3} /> : <div className="w-3 h-3 rounded-full border border-gray-300" />}
                                                        Pelo menos 1 número
                                                    </div>
                                                </div>
                                            )}
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Confirmar Nova Senha
											</label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
                                                        confirmPassword && !passwordsMatch 
                                                        ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                                                        : confirmPassword && passwordsMatch
                                                        ? 'border-green-300 focus:ring-green-200 focus:border-green-500'
                                                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                    }`}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="Repita a senha"
                                                />
                                                {confirmPassword && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold">
                                                        {passwordsMatch ? (
                                                            <span className="text-green-600 flex items-center gap-1"><Check size={14} /> Iguais</span>
                                                        ) : (
                                                            <span className="text-red-500 flex items-center gap-1"><X size={14} /> Diferentes</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
										</div>
									</div>
								</div>

								                                <div className="flex justify-center pt-4 border-t border-gray-50">

								                                    <button

								                                        type="submit"

								                                        disabled={loading}

								                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-100 transform hover:-translate-y-0.5 active:translate-y-0"

								                                    >

								                                        <Save size={18} /> Salvar Todas as Alterações

								                                    </button>

								                                </div>
							</form>

							<div className="pt-8 border-t border-gray-100 !mt-8">
								<div className="bg-red-50 border border-red-100 rounded-xl p-6 flex flex-col items-center">
									<h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
										<AlertTriangle size={20} /> Excluir Conta
									</h3>
									<p className="text-sm text-red-700 mb-6 text-center max-w-2xl">
										Ao excluir sua conta, você perderá acesso imediato a todos os seus documentos
										salvos, créditos restantes e histórico de defesas. Esta ação é irreversível e
										seus dados não poderão ser recuperados.
									</p>
									<button
										type="button"
										onClick={() => setShowDeleteModal(true)}
										className="bg-white border border-red-200 text-red-600 font-bold py-2.5 px-6 rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm flex items-center gap-2 shadow-sm">
										<Trash2 size={16} /> Excluir minha conta
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{showDeleteModal && (
				<div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
					<div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative p-8">
						<div className="text-center mb-6">
							<div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
								<AlertTriangle size={32} />
							</div>
							<h2 className="text-2xl font-bold text-gray-900">Tem certeza?</h2>
						</div>

						<div className="space-y-4 text-gray-600 mb-8 text-center text-md">
							<p>
								Esta ação <strong>não pode ser desfeita</strong>.
							</p>
							<p>
								Você perderá todos os seus créditos ({userData?.credits || 0}) e o acesso a todos os
								recursos salvos no histórico.
							</p>
							<div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-md">
								<p className="font-bold mb-1">Está com algum problema?</p>
								<p className="mb-2">Nossa equipe pode te ajudar antes de você decidir partir.</p>
								<Link
									to="/help"
									className="inline-block bg-white text-blue-600 px-3 py-1.5 rounded-lg font-bold border border-blue-200 hover:bg-blue-50">
									Falar com Suporte
								</Link>
							</div>
						</div>

						<div className="flex flex-col gap-3">
							<button
								onClick={handleDeleteAccount}
								disabled={loading}
								className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
								{loading ? "Excluindo..." : "Sim, excluir minha conta"}
							</button>
							<button
								onClick={() => setShowDeleteModal(false)}
								disabled={loading}
								className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">
								Cancelar
							</button>
						</div>
					</div>
				</div>
			)}

            {showSuccessModal && (
                <DownloadSuccessModal
                    onClose={() => {
                        setShowSuccessModal(false);
                        setSelectedDefense(null);
                    }}
                    btnText="Fechar"
                    onBtnClick={() => {
                        setShowSuccessModal(false);
                        setSelectedDefense(null);
                    }}
                    handleSendEmail={async () => {
                        const targetDefense = selectedDefense || defenses[0];
                        if (targetDefense) {
                            return await emailPDF(targetDefense);
                        } else {
                            alert("Aguarde um instante para carregar seus dados. Tente novamente em alguns segundos.");
                            return false;
                        }
                    }}
                />
            )}
            {showFeedbackModal && (
                <FeedbackModal onClose={() => setShowFeedbackModal(false)} />
            )}

			{showEmailVerificationModal && (
				<div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
					<div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative p-8">
						<div className="text-center mb-6">
							<div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600">
								<Mail size={32} />
							</div>
							<h2 className="text-2xl font-bold text-gray-900">Email não verificado</h2>
						</div>
						
						<p className="text-gray-600 text-center mb-8 leading-relaxed">
							Por questões de segurança, para enviar o recurso por email, é necessário que o seu endereço de email esteja verificado.
						</p>

						<div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8">
							<div className="flex items-start gap-3">
								<AlertTriangle className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
								<div className="text-sm text-blue-800">
									<p className="font-semibold mb-1">Verifique seu email</p>
									<p>Clique no link enviado para <strong>{currentUser?.email}</strong> para concluir a verificação.</p>
								</div>
							</div>
						</div>

						{verificationSent ? (
							<div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6 flex items-center gap-3 animate-in slide-in-from-bottom-2">
								<CheckCircle size={20} />
								<span className="text-sm font-medium">Novo email de verificação enviado! Verifique sua caixa de entrada e SPAM.</span>
							</div>
						) : (
							<button
								onClick={handleResendVerification}
								disabled={resendingVerification}
								className="w-full mb-3 flex items-center justify-center gap-2 bg-white border-2 border-blue-600 text-blue-600 font-bold py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-sm disabled:opacity-50">
								<Send size={20} />
								{resendingVerification ? "Enviando..." : "Reenviar Email de Verificação"}
							</button>
						)}

						<button
							onClick={() => {
								setShowEmailVerificationModal(false);
								setVerificationSent(false);
							}}
							className="w-full bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors">
							Fechar
						</button>
					</div>
				</div>
			)}
		</MainLayout>
	);
}