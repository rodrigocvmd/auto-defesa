import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
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
	AlertCircle,
	CheckCircle,
	Plus,
	Coins,
	AlertTriangle,
	Trash2,
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

export default function Profile() {
	const { currentUser, userData, updateUserEmail, deleteUserAccount } = useAuth();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("defenses");
	const [loading, setLoading] = useState(false);
	const [pageLoading, setPageLoading] = useState(true);
	const [message, setMessage] = useState({ type: "", content: "" });
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedDefense, setSelectedDefense] = useState(null);

	// Estados do Formulário de Perfil
	const [displayName, setDisplayName] = useState("");
	const [email, setEmail] = useState("");

	// Estados do Formulário de Senha
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	// Estado do Histórico
	const [defenses, setDefenses] = useState([]);

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
				content: "Nome completo deve ter pelo menos 2 palavras com 2 caracteres cada.",
			});
			return;
		}

		setLoading(true);
		setMessage({ type: "", content: "" });

		try {
			let successMsg = "";

			// 1. Atualizar Email (se mudou)
			if (email !== currentUser.email) {
				try {
					await updateUserEmail(email);
					successMsg += `Email de verificação enviado para ${email}. Confirme para concluir a alteração. `;
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
				if (newPassword !== confirmPassword) {
					throw new Error("As senhas não conferem.");
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

		let contentHtml = defense.defenseText;
		if (!contentHtml.match(/<p|<h[1-6]|<div/)) {
			contentHtml = formatDefenseToHtml(contentHtml);
		}
        
        let fileName = defense.fileName;
        if (!fileName) {
             fileName = `Recurso_${defense.licensePlate || "Final"}`;
        }
        if (!fileName.toLowerCase().endsWith(".pdf")) {
            fileName += ".pdf";
        }

		try {
            // Chamada ao Backend via API
			const blob = await api.generatePdf(contentHtml, fileName);
            
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

	return (
		<MainLayout>
			<div className="max-w-4xl mx-auto">
				{/* Header do Perfil */}
				<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6 flex flex-col md:flex-row items-center gap-6">
					<div className="bg-blue-100 p-6 rounded-full text-blue-600">
						<User size={48} />
					</div>
					<div className="text-center md:text-left flex-1">
						<h1 className="text-2xl font-bold text-gray-900">
							{currentUser?.displayName || "Usuário"}
						</h1>
						<p className="text-gray-500">{currentUser?.email}</p>
						<p className="text-xs text-gray-400 mt-1">
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
						<div className="text-3xl font-black text-gray-900 mb-2">{userData?.credits || 0}</div>
						<Link
							to="/pricing"
							className="text-xs bg-blue-600 text-white px-4 py-1.5 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-sm">
							Adquirir mais
						</Link>
					</div>
				</div>

				{/* Navegação de Abas */}
				<div className="flex flex-col md:flex-row md:overflow-x-auto gap-2 mb-6 pb-2 md:pb-0 justify-center">
					<button
						onClick={() => setActiveTab("defenses")}
						className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
							activeTab === "defenses"
								? "bg-blue-600 text-white shadow-sm"
								: "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
						}`}>
						<FileText size={18} /> Minhas Defesas
					</button>
					<button
						onClick={() => setActiveTab("data-security")}
						className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
							activeTab === "data-security"
								? "bg-blue-600 text-white shadow-sm"
								: "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
						}`}>
						<Shield size={18} /> Dados e Segurança
					</button>
				</div>

				{/* Conteúdo das Abas */}
				<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 md:p-8">
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
												<div>
													<h3 className="font-semibold text-gray-900">
														{defense.fileName ? defense.fileName.replace(/\.pdf$/i, "") : (defense.infractionType || "Infração não especificada")}
													</h3>
													<div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
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
													onClick={() => downloadPDF(defense)}
													className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
													title="Baixar PDF">
													<Download size={20} />
												</button>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-12 text-gray-500">
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
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Confirmar Nova Senha
											</label>
											<input
												type="password"
												className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
												value={confirmPassword}
												onChange={(e) => setConfirmPassword(e.target.value)}
												placeholder="Repita a senha"
											/>
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

							<div className="pt-12 border-t border-gray-100">
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

						<div className="space-y-4 text-gray-600 mb-8 text-center text-sm">
							<p>
								Esta ação <strong>não pode ser desfeita</strong>.
							</p>
							<p>
								Você perderá todos os seus créditos ({userData?.credits || 0}) e o acesso a todos os
								recursos salvos no histórico.
							</p>
							<div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-xs">
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
		</MainLayout>
	);
}