import React, { useState, useEffect } from "react";
import {
	UploadCloud,
	File,
	X,
	ArrowLeft,
	Loader2,
	CheckCircle,
	AlertTriangle,
	PenTool,
	Download,
	Send,
	RotateCcw,
	FileCheck,
	User,
	Car,
	MapPin,
	Gauge,
	Info,
	Search,
	Lock,
	FileText,
	AlertCircle,
	Scale,
	Gavel,
	FileWarning,
	HelpCircle,
	ArrowDown,
	Upload,
	Copy,
	Coins,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import SEO from "../components/SEO";
import { api } from "../services/api";
import { jsPDF } from "jspdf";
import { useAuth } from "../contexts/AuthContext";
import { useDefense } from "../contexts/DefenseContext";
import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { NavigationBlocker } from "../components/NavigationBlocker";
import { rateLimiter } from "../services/rateLimiter";

const UploadDefense = () => {
	const { currentUser, userData } = useAuth();
	const navigate = useNavigate();
	const { step: routeStep } = useParams();
	
	// Context
	const {
		formData,
		setFormData,
		analysisData,
		setAnalysisData,
		defenseResult: result,
		setDefenseResult: setResult,
		defenseId,
		setDefenseId,
		resetDefense
	} = useDefense();

	// Computed step from route
	const step = routeStep || "upload";

	// Local UI States
	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [loadingCep, setLoadingCep] = useState(false);
	const [error, setError] = useState(null);
	const [isDragging, setIsDragging] = useState(false);
	const [isRefining, setIsRefining] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [refinementText, setRefinementText] = useState("");
	const [refining, setRefining] = useState(false);
	const [errors, setErrors] = useState({});
	const [searchingCode, setSearchingCode] = useState(false);
	const [showHelpModal, setShowHelpModal] = useState(false);
	const [showCodeNotFoundModal, setShowCodeNotFoundModal] = useState(false);
	const [isManualInfraction, setIsManualInfraction] = useState(false);
	const [showPostDownloadModal, setShowPostDownloadModal] = useState(false);

	// Novos estados para alertas
	const [showEditWarning, setShowEditWarning] = useState(false);
	const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
	const [showDivergenceModal, setShowDivergenceModal] = useState(false);
	const [loadingText, setLoadingText] = useState(
		"Analisando os dados para definir a viabilidade do recurso e possíveis teses a serem aplicadas...",
	);

	// Rate Limiting States
	const [showLimitModal, setShowLimitModal] = useState(false);
	const [showLoginPrompt, setShowLoginPrompt] = useState(false);
	const [consecutiveDivergenceCount, setConsecutiveDivergenceCount] = useState(0);
	const [refinementCount, setRefinementCount] = useState(5);

	// Set default defense type if not set
	useEffect(() => {
		if (!formData.defenseType) {
			setFormData(prev => ({ ...prev, defenseType: "Análise de Upload" }));
		}
	}, []);

	useEffect(() => {
		// Loading text is now static as requested
		setLoadingText(
			"Analisando os dados para definir a viabilidade do recurso e possíveis teses a serem aplicadas...",
		);
	}, [loading]);

	// Reset state if user navigates back to start (Clean Slate)
	useEffect(() => {
		if (step === "upload" && result) {
			resetDefense();
		}
	}, [step, result, resetDefense]);

	// EFEITO PARA RESTAURAR DADOS PENDENTES APÓS LOGIN
	useEffect(() => {
		const pendingData = localStorage.getItem("pendingDefenseData");
		if (pendingData && currentUser) {
			try {
				const parsedData = JSON.parse(pendingData);
				if (parsedData.source === "upload") {
					setFormData(parsedData.formData);
					setAnalysisData(parsedData.analysisData);
					navigate("/upload/analysis");
					localStorage.removeItem("pendingDefenseData");
				}
			} catch (e) {
				console.error("Erro ao restaurar dados pendentes", e);
			}
		}
	}, [currentUser]);

	// --- LÓGICA DE UPLOAD E EXTRAÇÃO ---

	const fileToBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				const base64String = reader.result.split(",")[1];
				resolve(base64String);
			};
			reader.onerror = (error) => reject(error);
		});
	};

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
		setResult(null);
		setError(null);
	};

	const [showHardBlockModal, setShowHardBlockModal] = useState(false);
	const [hardBlockInfo, setHardBlockInfo] = useState(null);

	const handleUploadAndExtract = async (bypass = false) => {
		if (!file) return;

		// Record bypass if applicable
		const isAnonymous = !currentUser;
		if (bypass) {
			await rateLimiter.recordBypass("upload_analysis", currentUser);
		}

		// Rate Limit Check for Upload
		const limitStatus = await rateLimiter.checkLimit("upload_analysis", currentUser);

		if (limitStatus.hardBlocked) {
			setHardBlockInfo({
				expiresAt: limitStatus.expiresAt,
				message: limitStatus.message,
			});
			setShowHardBlockModal(true);
			return;
		}

		if (!bypass && !limitStatus.allowed) {
			if (isAnonymous) {
				setShowLoginPrompt(true);
			} else {
				setShowLimitModal(true);
			}
			return;
		}

		setLoading(true);
		setError(null);
		try {
			const base64 = await fileToBase64(file);
			// Chama a nova função de extração
			const response = await api.extractData(base64, file.type);

			// Record usage on attempt (even if extraction fails partially, we utilized the AI)
			await rateLimiter.recordUsage("upload_analysis", currentUser);

			if (response.success) {
				let extractedData = response.data;

				// Always try to fetch details from DB to ensure accurate Legal Basis (Amparo) and Description
				if (extractedData.infractionCode) {
					try {
						const infractionRes = await api.getInfraction({
							code: extractedData.infractionCode,
							desdobramento: extractedData.infractionSplit,
						});
						if (infractionRes && infractionRes.success) {
							// Overwrite OCR data with authoritative DB data where available
							if (infractionRes.data.article) extractedData.article = infractionRes.data.article;
							if (infractionRes.data.description)
								extractedData.infractionDescription = infractionRes.data.description;
							if (infractionRes.data.legalText)
								extractedData.legalText = infractionRes.data.legalText;
							else if (infractionRes.data.description)
								extractedData.legalText = infractionRes.data.description; // Fallback
						}
					} catch (ignore) {
						console.log("Failed to auto-fetch article from code", ignore);
					}
				}

				// Separamos a descrição (que vem do OCR como descrição da infração) para não sobrescrever o relato do usuário
				const { description: ocrDescription, ...otherData } = extractedData;

				// Atualiza o formulário com os dados da IA
				setFormData((prev) => ({
					...prev,
					...otherData,
					equipmentNumber: otherData.equipmentNumber || "Não disponível",
					lastCalibration: otherData.lastCalibration || "Não disponível",
					infractionDescription:
						ocrDescription || extractedData.infractionDescription || prev.infractionDescription,
					legalText: extractedData.legalText || ocrDescription || prev.legalText, // Fallback para description
					// Mantém alguns defaults se a IA não achar
					nationality: extractedData.nationality || prev.nationality,
					signDate: extractedData.signDate || prev.signDate,
					// Garante que o relato do usuário não seja sobrescrito pela descrição da infração
					description: prev.description,
				}));

				// Lógica de Fase Detectada
				if (extractedData.defensePhase) {
					// Mapear retorno da IA para o state interno
					let detectedType = "";
					const phaseLower = extractedData.defensePhase.toLowerCase();
					if (phaseLower.includes("previa") || phaseLower.includes("autuação"))
						detectedType = "previa";
					else if (
						phaseLower.includes("jari") ||
						phaseLower.includes("penalidade") ||
						phaseLower.includes("boleto")
					)
						detectedType = "jari";
					else if (phaseLower.includes("cetran") || phaseLower.includes("contradife"))
						detectedType = "cetran";

					if (detectedType) {
						setFormData((prev) => ({ ...prev, defenseType: detectedType }));
						navigate("/upload/phaseConfirmation");
					} else {
						navigate("/upload/phaseSelection");
					}
				} else {
					navigate("/upload/phaseSelection");
				}
			}
		} catch (e) {
			console.error(e);
			setError(
				"Não foi possível ler os dados da imagem automaticamente. Mas você pode preencher manualmente.",
			);
			// Se der erro na leitura, ainda assim pergunta a fase, pois o usuário vai preencher manual
			setTimeout(() => navigate("/upload/phaseSelection"), 2000);
		} finally {
			setLoading(false);
		}
	};

	// --- LÓGICA DO FORMULÁRIO (Igual ManualDefense) ---

	useEffect(() => {
		if (formData.city && !formData.signCity) {
			setFormData((prev) => ({ ...prev, signCity: prev.city }));
		}
	}, [formData.city]);

	const isValidCPF = (cpf) => {
		cpf = cpf.replace(/[^\d]+/g, "");
		if (cpf === "" || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
		let add = 0;
		for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
		let rev = 11 - (add % 11);
		if (rev === 10 || rev === 11) rev = 0;
		if (rev !== parseInt(cpf.charAt(9))) return false;
		add = 0;
		for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
		rev = 11 - (add % 11);
		if (rev === 10 || rev === 11) rev = 0;
		if (rev !== parseInt(cpf.charAt(10))) return false;
		return true;
	};

	const handleChange = (e) => {
		let { name, value } = e.target;
		value = value || "";
		if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));

		if (name === "cnh") {
			value = value.replace(/\D/g, "").slice(0, 11);
		}
		if (name === "aitNumber") {
			value = value.slice(0, 10);
		}

		if (name === "cpf") {
			value = value.replace(/\D/g, "").slice(0, 11);
			if (value.length > 9) value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
		}
		if (name === "phone") {
			value = value.replace(/\D/g, "").slice(0, 11);
			if (value.length > 10) value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
		}
		if (name === "rg") {
			// Máscara de RG: Limite de 7 números
			// Formato: x.xxx.xxx (7 dígitos) ou xxx.xxx (6 dígitos)
			value = value.replace(/\D/g, "").slice(0, 7);
			if (value.length === 7) {
				value = value.replace(/(\d{1})(\d{3})(\d{3})/, "$1.$2.$3");
			} else if (value.length > 3) {
				value = value.replace(/(\d{3})(\d+)/, "$1.$2");
			}
		}
		if (name === "date" || name === "signDate" || name === "lastCalibration") {
			value = value.replace(/\D/g, "").slice(0, 8);
			if (value.length > 4) value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
			else if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`;
		}
		if (name === "time") {
			value = value.replace(/\D/g, "").slice(0, 4);
			if (value.length > 2) value = `${value.slice(0, 2)}:${value.slice(2)}`;
		}
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const validateField = (name, value) => {
		let error = null;
		const requiredFields = [
			"name",
			"cpf",
			"rg",
			"rgIssuer",
			"nationality",
			"maritalStatus",
			"cnh",
			"phone",
			"email",
			"zipCode",
			"address",
			"addressNumber",
			"neighborhood",
			"city",
			"state",
			"plate",
			"plateUF",
			"vehicleModel",
			"aitNumber",
			"infractionCode",
			"issuingBody",
			"date",
			"time",
			"location",
			"description",
			"equipmentNumber",
			"lastCalibration",
			"signCity",
			"signDate",
		];
		if (requiredFields.includes(name) && !value.trim()) return "Campo obrigatório.";
		if (value.trim()) {
			switch (name) {
				case "name":
					const nameParts = value.trim().split(/\s+/);
					if (nameParts.length < 2 || nameParts.some((part) => part.length < 2))
						error = "Nome completo deve ter pelo menos 2 palavras com 2 caracteres cada.";
					break;
				case "cpf":
					if (!isValidCPF(value)) error = "CPF inválido.";
					break;
				case "cnh":
					if (value.length !== 11) error = "CNH deve ter 11 dígitos.";
					break;
				case "aitNumber":
					if (value.length !== 10) error = "AIT deve ter 10 caracteres.";
					break;
				case "rg":
					const rgRegex = /^(\d{3}\.\d{3}|\d{1}\.\d{3}\.\d{3})$/;
					if (!rgRegex.test(value)) error = "RG inválido.";
					break;
				case "email":
					if (!value.includes("@") || !value.includes(".")) error = "E-mail inválido.";
					break;
				case "date":
				case "signDate":
					if (value.length < 10) error = "Data incompleta (DD/MM/AAAA).";
					break;
				case "time":
					if (value.length < 5) error = "Horário incompleto (HH:MM).";
					break;
				case "phone":
					if (value.length < 14) error = "Telefone incompleto.";
					break;
				default:
					break;
			}
		}
		return error;
	};

	const handleBlur = (e) => {
		const { name, value } = e.target;
		if (name === "zipCode") handleCepBlur(e);
		const error = validateField(name, value);
		setErrors((prev) => ({ ...prev, [name]: error }));
	};

	const validateForm = () => {
		const newErrors = {};
		let isValid = true;
		Object.keys(formData).forEach((key) => {
			const error = validateField(key, formData[key] || "");
			if (error) {
				newErrors[key] = error;
				isValid = false;
			}
		});
		setErrors(newErrors);
		return isValid;
	};

	const handleCepBlur = async (e) => {
		const cep = e.target.value.replace(/\D/g, "");
		if (cep.length !== 8) return;
		setLoadingCep(true);
		try {
			const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
			const data = await response.json();
			if (!data.erro) {
				setFormData((prev) => ({
					...prev,
					address: data.logradouro || "",
					neighborhood: data.bairro || "",
					city: data.localidade || "",
					state: data.uf || "",
					signCity: data.localidade || prev.signCity,
				}));
				setErrors((prev) => ({
					...prev,
					address: null,
					neighborhood: null,
					city: null,
					state: null,
				}));
			}
		} finally {
			setLoadingCep(false);
		}
	};

	const handleSearchCode = async () => {
		if (!formData.infractionCode) return;
		setSearchingCode(true);
		try {
			const response = await api.getInfraction({
				code: formData.infractionCode,
				desdobramento: formData.infractionSplit,
			});
			if (response && response.success) {
				const { article, description, legalText } = response.data;
				setFormData((prev) => ({
					...prev,
					article: article || prev.article,
					infractionDescription: description || prev.infractionDescription,
					// Se legalText não vier da API, usamos a descrição como fallback para preencher o campo Dispositivo Legal
					legalText: legalText || description || prev.legalText,
				}));
				setIsManualInfraction(false);
			} else {
				setShowCodeNotFoundModal(true);
			}
		} catch (error) {
			setShowCodeNotFoundModal(true);
		} finally {
			setSearchingCode(false);
		}
	};

	// --- AÇÕES DO FORMULÁRIO ---

	const handlePreAnalysis = async (e, bypass = false) => {
		if (e) e.preventDefault();

		// Record bypass if applicable
		const isAnonymous = !currentUser;
		if (bypass) {
			await rateLimiter.recordBypass("upload_case_analysis", currentUser);
		}

		// Rate Limiting Check
		const limitStatus = await rateLimiter.checkLimit("upload_case_analysis", currentUser);

		if (limitStatus.hardBlocked) {
			setHardBlockInfo({
				expiresAt: limitStatus.expiresAt,
				message: limitStatus.message,
			});
			setShowHardBlockModal(true);
			return;
		}

		if (!bypass && !limitStatus.allowed) {
			if (consecutiveDivergenceCount >= 2) {
				// Bypass
			} else {
				if (isAnonymous) {
					setShowLoginPrompt(true);
				} else {
					setShowLimitModal(true);
				}
				return;
			}
		}

		if (!validateForm()) {
			window.scrollTo({ top: 0, behavior: "smooth" });
			return;
		}
		setLoading(true);
		try {
			const response = await api.preAnalyze(formData);
			await rateLimiter.recordUsage("upload_case_analysis", currentUser);

			if (response.success) {
				setAnalysisData(response.data);
				if (response.data.divergence && response.data.divergence.isDivergent) {
					if (
						consecutiveDivergenceCount >= 2 ||
						(!limitStatus.allowed && consecutiveDivergenceCount > 0)
					) {
						navigate("/upload/analysis");
						setConsecutiveDivergenceCount(0);
					} else {
						setConsecutiveDivergenceCount((prev) => prev + 1);
						setShowDivergenceModal(true);
					}
				} else {
					setConsecutiveDivergenceCount(0);
					navigate("/upload/analysis");
				}
			}
		} catch (err) {
			alert("Erro na análise preliminar. Tente novamente.");
		} finally {
			setLoading(false);
		}
	};

	const handleUnlockDefense = async () => {
		setLoading(true);
		try {
			const response = await api.generateDefense({ ...formData, userId: currentUser?.uid });
			if (response.success) {
				setResult(response.data.defenseText);
				if (currentUser) {
					try {
						const docRef = await addDoc(collection(db, "defenses"), {
							userId: currentUser.uid,
							infractionType: "Análise de Upload",
							licensePlate: formData.plate,
							defenseText: response.data.defenseText,
							status: "completed",
							createdAt: serverTimestamp(),
							fileName: file ? file.name : "upload",
						});
						setDefenseId(docRef.id);
					} catch (fsError) {
						console.error("Erro ao salvar no histórico:", fsError);
					}
				}
				navigate("/upload/result");
			}
		} catch (err) {
			if (err.message && err.message.includes("Créditos insuficientes")) {
				const confirm = window.confirm(
					"Você precisa de 1 crédito para gerar a defesa completa. Deseja adquirir agora?",
				);
				if (confirm) navigate("/pricing");
			} else {
				alert("Erro ao gerar defesa: " + err.message);
			}
		} finally {
			setLoading(false);
		}
	};

	const saveDefenseToHistory = async (textToSave) => {
		if (defenseId && currentUser && textToSave) {
			try {
				const defenseRef = doc(db, "defenses", defenseId);
				await updateDoc(defenseRef, {
					defenseText: textToSave,
					updatedAt: serverTimestamp(),
				});
			} catch (fsError) {
				console.error("Erro ao atualizar histórico:", fsError);
			}
		}
	};

	const handleRefinementSubmit = async () => {
		if (!refinementText.trim()) return;

		const currentCount = await rateLimiter.getRefinementCount(
			defenseId || "temp_upload",
			currentUser,
		);
		if (currentCount <= 0) {
			alert("Limite de edições via IA atingido para este recurso.");
			return;
		}

		setRefining(true);
		try {
			const response = await api.generateDefense({
				...formData,
				previousDefense: result,
				refinementInstructions: refinementText,
				userId: currentUser?.uid,
			});
			if (response.success) {
				const newText = response.data.defenseText;
				setResult(newText);
				setIsRefining(false);
				setRefinementText("");

				rateLimiter.decrementRefinementCount(defenseId || "temp_upload");
				setRefinementCount(currentCount - 1);

				await saveDefenseToHistory(newText);
			}
		} catch (err) {
			alert("Erro ao atualizar: " + (err.message || "Tente novamente."));
		} finally {
			setRefining(false);
		}
	};

	// --- MODAIS ---
	const handleEditClick = async () => {
		if (isEditing) {
			setIsEditing(false);
			await saveDefenseToHistory(result);
		} else {
			setShowEditWarning(true);
		}
	};
	const confirmEdit = () => {
		setShowEditWarning(false);
		setIsEditing(true);
	};
	const handleDownloadClick = () => {
		setShowDownloadConfirm(true);
	};
	const confirmDownload = async () => {
		setShowDownloadConfirm(false);
		await saveDefenseToHistory(result);
		handleFinalizePDF();
	};

	const handleFinalizePDF = () => {
		if (!result || typeof result !== "string") {
			alert("Nenhum conteúdo válido para baixar.");
			return;
		}
		try {
			const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
			doc.setFont("times", "normal");
			doc.setFontSize(12);
			const splitText = doc.splitTextToSize(result, 160);
			let cursorY = 25;
			splitText.forEach((line) => {
				if (cursorY > 270) {
					doc.addPage();
					cursorY = 25;
				}
				const isTitle = line.length < 50 && line === line.toUpperCase() && line.trim().length > 0;
				if (isTitle) {
					doc.setFont("times", "bold");
					doc.text(line, 105, cursorY, { align: "center" });
					doc.setFont("times", "normal");
				} else {
					doc.text(line, 25, cursorY, { align: "justify", maxWidth: 160 });
				}
				cursorY += 6;
			});
			doc.save(`Defesa_${formData.plate || "Recurso"}.pdf`);
			setShowPostDownloadModal(true);
		} catch (err) {
			console.error("Erro ao gerar PDF:", err);
			alert("Ocorreu um erro ao gerar o PDF. Tente novamente.");
		}
	};

	const EditWarningModal = () => (
		<div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
			<div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative p-6">
				<h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
					<AlertTriangle className="text-amber-500" /> Atenção na Edição
				</h3>
				<p className="text-gray-600 mb-6">
					Use a ferramenta de edição manual apenas para corrigir <strong>erros pontuais</strong>.
					Para alterar o conteúdo, recomendamos utilizar a <strong>IA de Refinamento</strong>.
				</p>
				<div className="flex justify-end gap-3">
					<button
						onClick={() => setShowEditWarning(false)}
						className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">
						Cancelar
					</button>
					<button
						onClick={confirmEdit}
						className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
						Entendi, quero editar
					</button>
				</div>
			</div>
		</div>
	);

	const CodeNotFoundModal = () => (
		<div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
			<div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative p-8">
				<div className="text-center mb-6">
					<div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600">
						<AlertTriangle size={32} />
					</div>
					<h2 className="text-2xl font-bold text-gray-900">Código não encontrado</h2>
				</div>
				<p className="text-gray-600 text-center mb-6">
					O código de infração informado não consta em nosso banco de dados. Sugerimos verificar se
					foi digitado corretamente.
				</p>

				<div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 text-sm text-yellow-800">
					<p className="font-bold flex items-center gap-2 mb-2">
						<Info size={16} /> Atenção:
					</p>
					<p>
						Se optar por prosseguir manualmente, você deverá inserir o <strong>Amparo Legal</strong>{" "}
						e a <strong>Descrição</strong> por conta própria.
						<br />
						<br />
						Nossa IA fará a defesa baseada no que você escrever, o que{" "}
						<strong>pode comprometer a qualidade técnica</strong> do recurso em comparação com
						infrações validadas pelo nosso sistema.
					</p>
				</div>

				<div className="flex flex-col gap-3">
					<button
						onClick={() => {
							setShowCodeNotFoundModal(false);
							setFormData((prev) => ({ ...prev, infractionCode: "", infractionSplit: "" }));
						}}
						className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">
						Corrigir Código
					</button>
					<button
						onClick={() => {
							setIsManualInfraction(true);
							setShowCodeNotFoundModal(false);
						}}
						className="w-full bg-white border border-gray-300 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">
						Manter código e preencher manualmente
					</button>
				</div>
			</div>
		</div>
	);

	const DownloadConfirmModal = () => (
		<div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
			<div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative p-6">
				<h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
					<CheckCircle className="text-green-500" /> Confirmar Versão Final
				</h3>

				<p className="text-gray-600 mb-6">
					Esta será a versão final do seu documento. Após confirmar, você será redirecionado.
				</p>

				<div className="flex justify-end gap-3">
					<button
						onClick={() => setShowDownloadConfirm(false)}
						className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">
						Voltar e Revisar
					</button>

					<button
						onClick={confirmDownload}
						className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700">
						Sim, Baixar PDF
					</button>
				</div>
			</div>
		</div>
	);

	const PostDownloadModal = () => (
		<div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
			<div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative p-8 max-h-[90vh] overflow-y-auto">
				<div className="text-center mb-6">
					<div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
						<CheckCircle size={32} />
					</div>
					<h2 className="text-2xl font-bold text-gray-900">Download Iniciado!</h2>
					<p className="text-gray-500 mt-2 text-sm">
						Seu documento foi gerado com sucesso. Você pode baixá-lo novamente a qualquer momento em{" "}
						<strong>"Minhas Defesas"</strong> no seu perfil.
					</p>
				</div>

				<div className="bg-blue-50 rounded-xl p-6 mb-6">
					<h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
						<HelpCircle size={20} /> O que fazer agora?
					</h3>

					<div className="space-y-4">
						<div>
							<h4 className="font-bold text-blue-800 text-sm mb-2">
								Opção 1: Protocolo Digital (Recomendado)
							</h4>
							<ul className="text-sm text-blue-700 space-y-1 list-disc list-inside pl-2">
								<li>
									Imprimir, Assinar e Escanear (ou assinar via{" "}
									<a
										href="https://assinador.iti.br/assinatura"
										target="_blank"
										className="underline">
										<strong>gov.br</strong>
									</a>
									);
								</li>
								<li>Acessar o site do órgão autuador (Detran, DER, PRF...);</li>
								<li>
									Enviar o PDF do recurso junto com as cópias dos documentos (CNH, CRLV e
									Notificação).
								</li>
							</ul>
						</div>

						<div className="border-t border-blue-200 pt-4">
							<h4 className="font-bold text-blue-800 text-sm mb-2">
								Opção 2: Via Correios ou Pessoalmente
							</h4>
							<ul className="text-sm text-blue-700 space-y-1 list-disc list-inside pl-2">
								<li>Imprimir e Assinar o recurso;</li>
								<li>Anexar Cópia da CNH/RG e CRLV;</li>
								<li>Anexar a Notificação de Autuação/Penalidade.</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-3">
					<button
						onClick={() => {
							resetDefense();
							navigate("/profile");
						}}
						className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">
						Ir para Minhas Defesas
					</button>
				</div>
			</div>
		</div>
	);

	const DivergenceWarningModal = () => (
		<div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
			<div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative p-8">
				<div className="text-center mb-6">
					<div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
						<AlertTriangle size={32} />
					</div>

					<h2 className="text-2xl font-bold text-gray-900">Contradição Identificada</h2>
				</div>

				<div className="space-y-4 text-gray-600 mb-8 text-left">
					<p>
						Foi identificada uma inconsistência severa entre o seu <strong>relato</strong> e a{" "}
						<strong>materialidade da infração</strong>.
					</p>

					<div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
						<p className="text-sm font-bold text-red-800 mb-1">Qual é a contradição:</p>

						<p className="text-sm text-red-700 italic">"{analysisData?.divergence?.message}"</p>
					</div>

					<p className="text-sm">
						<strong>Atenção:</strong> Manter essas informações pode{" "}
						<strong>não ser positivo</strong> para o recurso, proporcionando inconsistências
						jurídicas e limitando significativamente os argumentos de defesa que a IA poderá
						utilizar.
					</p>
				</div>

				<div className="flex flex-col gap-3">
					<button
						onClick={() => setShowDivergenceModal(false)}
						className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">
						Alterar Relato (Recomendado)
					</button>

					<button
						onClick={() => {
							setShowDivergenceModal(false);

							navigate("/upload/analysis");
						}}
						className="w-full bg-white border border-gray-300 text-gray-500 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">
						Manter como está
					</button>
				</div>
			</div>
		</div>
	);

	const LimitExceededModal = () => (
		<div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
			<div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative p-6">
				<h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
					<AlertTriangle className="text-red-500" /> Limite de Testes Excedido
				</h3>
				<p className="text-gray-600 mb-6">
					Você atingiu o limite de utilizações gratuitas da nossa IA por hora. Para garantir a
					disponibilidade do serviço para todos, aguarde um pouco antes de tentar nova análise.
				</p>
				<div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
					<p className="text-sm text-blue-800 font-medium">
						Deseja pular a análise preliminar e ir direto para a elaboração do recurso final?
						<br />
						<span className="text-xs opacity-75">
							(Isso permitirá mais uma verificação gratuita no processo final)
						</span>
					</p>
				</div>
				<div className="flex flex-col gap-3">
					<button
						onClick={() => {
							setShowLimitModal(false);
							if (step === "upload") handleUploadAndExtract(true);
							else handlePreAnalysis(null, true);
						}}
						className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">
						Sim, prosseguir para Recurso
					</button>
					<button
						onClick={() => setShowLimitModal(false)}
						className="w-full bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 py-3 rounded-xl">
						Aguardar e tentar depois
					</button>
				</div>
			</div>
		</div>
	);

	const LoginPromptModal = () => (
		<div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
			<div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative p-6">
				<div className="text-center mb-4">
					<div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
						<User size={32} />
					</div>
					<h3 className="text-xl font-bold text-gray-900">Limite Gratuito Atingido</h3>
				</div>
				<p className="text-gray-600 mb-6 text-center">
					Você atingiu o limite de 3 testes gratuitos como visitante.
					<br />
					<br />
					<strong>Crie sua conta ou faça login</strong> para continuar utilizando nossas ferramentas
					e desbloquear mais limites.
				</p>
				<div className="flex flex-col gap-3">
					<button
						onClick={() => {
							localStorage.setItem(
								"pendingDefenseData",
								JSON.stringify({ formData, source: "upload" }),
							);
							navigate("/register?redirect=/upload");
						}}
						className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">
						Criar Conta Grátis
					</button>
					<button
						onClick={() => {
							localStorage.setItem(
								"pendingDefenseData",
								JSON.stringify({ formData, source: "upload" }),
							);
							navigate("/login?redirect=/upload");
						}}
						className="w-full bg-white border border-gray-300 text-blue-600 font-bold py-3 rounded-xl hover:bg-gray-50">
						Já tenho conta
					</button>
					<button
						onClick={() => setShowLoginPrompt(false)}
						className="w-full text-gray-400 text-sm hover:text-gray-600 py-2">
						Cancelar
					</button>
				</div>
			</div>
		</div>
	);

	// --- RENDERS ---

	if (step === "result" && result) {
		return (
			<MainLayout>
				<NavigationBlocker when={!!result} />

				{loading && (
					<div className="fixed inset-0 bg-white/90 z-[100] flex flex-col items-center justify-center p-4 text-center backdrop-blur-sm animate-in fade-in duration-300">
						<Loader2 size={60} className="text-blue-600 animate-spin mb-4" />

						<h2 className="text-2xl font-black text-gray-900 mb-2">Construindo sua Defesa...</h2>

						<p className="text-gray-600 max-w-md font-bold">{loadingText}</p>

						<div className="mt-8 flex gap-2">
							<div className="h-1.5 w-12 bg-blue-100 rounded-full overflow-hidden">
								<div className="h-full bg-blue-600 animate-progress"></div>
							</div>
						</div>

						<style
							dangerouslySetInnerHTML={{
								__html: `

						                @keyframes progress {

						                    0% { width: 0%; }

						                    100% { width: 100%; }

						                }

						                .animate-progress {

						                    animation: progress 2s ease-in-out infinite;

						                }

						            `,
							}}
						/>
					</div>
				)}

				{showEditWarning && <EditWarningModal />}

				{showDownloadConfirm && <DownloadConfirmModal />}

				{showPostDownloadModal && <PostDownloadModal />}

				{showDivergenceModal && <DivergenceWarningModal />}
				{showLimitModal && <LimitExceededModal />}
				{showLoginPrompt && <LoginPromptModal />}
				{showHardBlockModal && <HardBlockModal />}
				<div className="max-w-5xl mx-auto py-8">
					<div className="sticky top-20 z-40 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-200 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 animate-in slide-in-from-top-4">
						<div>
							<h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
								<CheckCircle className="text-green-500" /> Defesa Gerada
							</h2>
							<p className="text-xs text-gray-500">Revise o documento abaixo antes de finalizar.</p>
						</div>
						<div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
							<button
								onClick={handleEditClick}
								className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-50 flex items-center justify-center gap-2">
								<FileText size={18} /> {isEditing ? "Salvar Edição" : "Editar Texto"}
							</button>
							<button
								onClick={() => setIsRefining(!isRefining)}
								disabled={refining}
								className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-50 flex items-center justify-center gap-2">
								{refining ? <Loader2 className="animate-spin" size={18} /> : <PenTool size={18} />}
								{isRefining ? "Cancelar" : "IA Ajustes"}
							</button>
							<button
								onClick={handleDownloadClick}
								className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 flex items-center justify-center gap-2 shadow-md">
								<Download size={18} /> Baixar PDF
							</button>
						</div>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						<div className={`${isRefining ? "lg:col-span-2" : "lg:col-span-3"} order-2 lg:order-1`}>
							{isEditing ? (
								<textarea
									value={result}
									onChange={(e) => setResult(e.target.value)}
									className="w-full p-12 shadow-2xl min-h-[800px] font-serif text-gray-900 leading-relaxed text-justify border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
								/>
							) : (
								<div className="bg-white p-12 shadow-2xl min-h-[800px] font-serif text-gray-900 leading-relaxed text-justify border border-gray-200 whitespace-pre-wrap">
									{result}
								</div>
							)}
						</div>
						{isRefining && (
							<div className="lg:col-span-1 space-y-6 order-1 lg:order-2">
								<div className="bg-blue-600 p-6 rounded-2xl shadow-xl text-white sticky top-40">
									<div className="flex justify-between items-center mb-2">
										<span className="text-xs font-bold uppercase tracking-wider text-blue-200">
											Refinamento com IA
										</span>
										<span className="bg-blue-800 text-xs px-2 py-1 rounded-full">
											{refinementCount} restantes
										</span>
									</div>
									<textarea
										value={refinementText}
										onChange={(e) => setRefinementText(e.target.value)}
										rows={6}
										className="w-full p-3 rounded-xl text-gray-900 text-sm"
										placeholder="Exemplos: 'Focar na falta de sinalização da via', 'Ajustar para tom mais formal', 'Remover argumento sobre a cor do veículo'."
									/>
									<div className="mt-4 flex justify-end">
										<button
											onClick={handleRefinementSubmit}
											disabled={!refinementText.trim() || refining || refinementCount <= 0}
											className={`bg-white text-blue-600 px-6 py-2 rounded-lg font-bold flex items-center gap-2 ${refinementCount <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}>
											Atualizar <Send size={16} />
										</button>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</MainLayout>
		);
	}

	if (step === "analysis" && analysisData) {
		const viability = analysisData.viability || "Possível";
		const summary = analysisData.summary;
		const isHighViability = viability === "Alta" || viability === "Muito Alta";
		const isPossibleViability = viability === "Possível";

		return (
			<MainLayout>
				{loading && (
					<div className="fixed inset-0 bg-white/90 z-[100] flex flex-col items-center justify-center p-4 text-center backdrop-blur-sm animate-in fade-in duration-300">
						<Loader2 size={60} className="text-blue-600 animate-spin mb-4" />
						<h2 className="text-2xl font-black text-gray-900 mb-2">Construindo sua Defesa...</h2>
						<p className="text-gray-600 max-w-md font-medium">
							Aguarde na página, nossa IA está aplicando as melhores teses jurídicas e resoluções do
							CONTRAN para garantir a máxima qualidade do seu recurso.
						</p>
						<p className="text-gray-600 max-w-md font-medium">
							O processamento das informações e elaboração do recurso pela IA Pro pode demorar até 1
							minuto.
						</p>
						<div className="mt-8 flex gap-2">
							<div className="h-1.5 w-12 bg-blue-100 rounded-full overflow-hidden">
								<div className="h-full bg-blue-600 animate-progress"></div>
							</div>
						</div>
						<style
							dangerouslySetInnerHTML={{
								__html: `
                @keyframes progress {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                .animate-progress {
                    animation: progress 2s ease-in-out infinite;
                }
            `,
							}}
						/>
					</div>
				)}
				<div className="max-w-2xl mx-auto py-12 px-4">
					<div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-4 duration-500">
						<div
							className={`p-8 text-center ${isHighViability ? "bg-green-50" : isPossibleViability ? "bg-green-50/50" : "bg-yellow-50"}`}>
							<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-sm mb-4">
								{isHighViability ? (
									<CheckCircle size={40} className="text-green-600" />
								) : isPossibleViability ? (
									<CheckCircle size={40} className="text-green-500" />
								) : (
									<AlertCircle size={40} className="text-yellow-600" />
								)}
							</div>
							<h2 className="text-2xl font-black text-gray-900 mb-2">Viabilidade {viability}</h2>
							<p className="text-gray-600 font-medium px-4">{summary}</p>
							<div className="mt-4 inline-block bg-blue-50 border border-blue-100 rounded-lg px-3 py-1 text-xs text-blue-700 font-medium">
								Análise preliminar realizada com IA Standard. O recurso final utilizará o Modelo Pro
								(Advogado Virtual).
							</div>
						</div>
						<div className="p-8">
							<h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
								<Search size={16} /> Teses Identificadas pela IA
							</h3>
							<div className="space-y-4 mb-6">
								{analysisData.arguments.slice(0, 3).map((arg, idx) => (
									<div
										key={idx}
										className="relative flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden max-h-[80px] select-none">
										<div className="bg-blue-100 p-1 rounded-full mt-0.5 shrink-0">
											<CheckCircle size={14} className="text-blue-600" />
										</div>
										<p className="text-gray-700 text-sm font-medium leading-relaxed">
											{arg.substring(0, 50)}
											<span
												style={{
													maskImage: "linear-gradient(to bottom right, black, transparent)",
													WebkitMaskImage: "linear-gradient(to bottom right, black, transparent)",
												}}>
												{arg.substring(50, 125)}
											</span>
											<span className="opacity-0">{arg.substring(125)}</span>
										</p>
									</div>
								))}
							</div>
							<div className="flex items-center justify-center gap-2 mb-8 text-blue-600 font-bold bg-blue-50 p-3 rounded-lg border border-blue-100 border-dashed">
								<Lock size={16} />
								<span>
									+ {Math.max(2, analysisData.arguments.length - 3 + 2)} teses exclusivas
									identificadas
								</span>
							</div>
							<div className="bg-blue-600 rounded-2xl p-6 text-white text-center shadow-lg shadow-blue-200">
								<div className="flex items-center justify-center gap-2 mb-2 opacity-90">
									<Lock size={16} />
									<span className="text-sm font-medium">Recurso Completo Bloqueado</span>
								</div>
								<h3 className="text-xl font-bold mb-4">Desbloquear Defesa Pronta</h3>
								<p className="text-blue-100 text-sm mb-6">
									Nossa IA já estruturou toda a argumentação jurídica baseada nas teses acima. Baixe
									o documento final editável agora.
								</p>

								{!currentUser ? (
									<div className="flex flex-col gap-3">
										<p className="text-blue-100 text-sm mb-2 font-medium">
											Você precisa estar logado para gerar o documento final.
										</p>
										<button
											onClick={() => {
												localStorage.setItem(
													"pendingDefenseData",
													JSON.stringify({
														formData,
														analysisData,
														source: "upload",
													}),
												);
												navigate("/register?redirect=/upload");
											}}
											className="w-full bg-white text-blue-600 font-black py-4 rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2">
											Salvar Análise e Criar Conta <User size={20} />
										</button>
										<button
											onClick={() => {
												localStorage.setItem(
													"pendingDefenseData",
													JSON.stringify({
														formData,
														analysisData,
														source: "upload",
													}),
												);
												navigate("/login?redirect=/upload");
											}}
											className="w-full bg-blue-700 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition-colors shadow-sm flex items-center justify-center gap-2 text-sm">
											Já tenho conta (Entrar)
										</button>
									</div>
								) : userData?.credits > 0 ? (
									<button
										onClick={handleUnlockDefense}
										disabled={loading}
										className={`w-full bg-white text-blue-600 font-black py-4 rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2 ${loading ? "opacity-75 cursor-not-allowed" : ""}`}>
										{loading ? (
											<>
												<Loader2 className="animate-spin" size={20} /> Gerando Defesa...
											</>
										) : (
											<>
												Utilizar 1 Crédito <FileText size={20} />
											</>
										)}
									</button>
								) : (
									<div className="flex flex-col gap-3">
										<div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-white text-sm">
											<p className="font-bold flex items-center gap-2 mb-1">
												<AlertTriangle size={16} /> Saldo Insuficiente
											</p>
											<p className="opacity-90">
												Você não possui créditos. Seus dados já estão salvos. Adquira créditos para
												finalizar agora.
											</p>
										</div>
										<button
											onClick={() => {
												localStorage.setItem(
													"pendingDefenseData",
													JSON.stringify({
														formData,
														analysisData,
														source: "upload",
													}),
												);
												navigate("/pricing?redirect=/upload");
											}}
											className="w-full bg-white text-blue-600 font-black py-4 rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2">
											Adquirir Créditos <Coins size={20} />
										</button>
										<button
											disabled
											className="w-full bg-gray-400/50 text-white/50 font-bold py-3 rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
											Utilizar 1 Crédito <FileText size={20} />
										</button>
									</div>
								)}

								<div className="mt-4 flex flex-col items-center">
									<span className="text-blue-200 text-xs uppercase font-bold tracking-widest mb-1">
										Seu Saldo Atual
									</span>
									<div className="bg-white/20 px-4 py-1 rounded-full text-white font-black text-lg flex items-center gap-2">
										{userData ? userData.credits : <Loader2 size={14} className="animate-spin" />}{" "}
										<span className="text-sm font-normal opacity-80">créditos</span>
									</div>
								</div>
							</div>
							<button
								onClick={() => navigate("/upload/form")}
								className="w-full text-center text-gray-400 text-sm mt-6 hover:text-gray-600">
								Voltar e editar dados
							</button>
						</div>
					</div>
				</div>
			</MainLayout>
		);
	}

	const HelpModal = ({ onClose }) => (
		<div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
			<div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
					<X size={24} className="text-gray-500" />
				</button>
				<div className="p-8">
					<h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
						<HelpCircle className="text-blue-600" /> Entenda as Fases da Defesa
					</h2>
					<div className="space-y-4">
						<div className="p-6 bg-yellow-50 rounded-2xl border border-yellow-100 shadow-sm hover:shadow-md transition-shadow">
							<h3 className="font-bold text-lg text-yellow-900 mb-3 flex items-center gap-2">
								<FileWarning size={22} /> 1. Defesa Prévia (Autuação)
							</h3>
							<p className="text-sm text-yellow-800 leading-relaxed">
								É a primeira oportunidade de defesa, quando você recebe a{" "}
								<strong>Notificação de Autuação</strong> (ainda sem código de barras para
								pagamento).
								<br />
								<br />
								<strong>Objetivo:</strong> Apontar <strong>erros formais</strong> (ex: placa errada,
								cor do veículo divergente, local inexistente) para anular a infração antes que ela
								se torne uma penalidade (multa).
							</p>
						</div>
						<div className="flex justify-center text-gray-300">
							<ArrowDown size={32} />
						</div>
						<div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
							<h3 className="font-bold text-lg text-blue-900 mb-3 flex items-center gap-2">
								<Gavel size={22} /> 2. Recurso à JARI (1ª Instância)
							</h3>
							<p className="text-sm text-blue-800 leading-relaxed">
								Deve ser apresentado quando você já recebeu a{" "}
								<strong>Notificação de Penalidade</strong> (o boleto com valor a pagar) ou teve a
								Defesa Prévia indeferida.
								<br />
								<br />
								<strong>Objetivo:</strong> Discutir o <strong>mérito da infração</strong>. Aqui
								argumentamos se a infração realmente ocorreu ou se houve justificativa legal,
								contestando a aplicação da penalidade.
							</p>
						</div>
						<div className="flex justify-center text-gray-300">
							<ArrowDown size={32} />
						</div>
						<div className="p-6 bg-purple-50 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
							<h3 className="font-bold text-lg text-purple-900 mb-3 flex items-center gap-2">
								<Scale size={22} /> 3. Recurso ao CETRAN (2ª Instância)
							</h3>
							<p className="text-sm text-purple-800 leading-relaxed">
								É a última tentativa na esfera administrativa, cabível apenas se o seu{" "}
								<strong>Recurso à JARI foi negado</strong>.<br />
								<br />
								<strong>Objetivo:</strong> Levar o caso para um colegiado superior (Conselho
								Estadual de Trânsito) para reavaliar a decisão da JARI.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	if (step === "phaseConfirmation") {
		const typeLabels = {
			previa: "Defesa Prévia",
			jari: "Recurso à JARI",
			cetran: "Recurso ao CETRAN",
		};
		const detectedLabel = typeLabels[formData.defenseType] || formData.defenseType;

		return (
			<MainLayout>
				<div className="max-w-2xl mx-auto py-12 px-4">
					<div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 text-center p-8 animate-in slide-in-from-bottom-4">
						<div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
							<CheckCircle size={40} />
						</div>
						<h2 className="text-2xl font-black text-gray-900 mb-2">Fase Identificada!</h2>
						<p className="text-gray-600 mb-8">
							Nossa IA analisou seu documento e identificou que se trata de uma:
							<br />
							<span className="text-2xl font-bold text-blue-600 mt-2 block">{detectedLabel}</span>
						</p>

						<div className="flex flex-col gap-3">
							<button
								onClick={() => navigate("/upload/form")}
								className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg">
								Correto, prosseguir com {detectedLabel}
							</button>
							<button
								onClick={() => navigate("/upload/phaseSelection")}
								className="text-gray-500 font-medium hover:text-gray-700 py-2">
								Não, escolher outra fase manualmente
							</button>
						</div>
					</div>
				</div>
			</MainLayout>
		);
	}

	if (step === "phaseSelection") {
		return (
			<MainLayout>
				{showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}
				<div className="max-w-4xl mx-auto py-10">
					<header className="mb-12 text-center">
						<button
							onClick={() => navigate("/upload")}
							className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors">
							<ArrowLeft size={20} className="mr-1" /> Voltar
						</button>
						<h1 className="text-3xl font-bold text-gray-900 mb-4">Qual fase da defesa?</h1>
						<p className="text-gray-600">
							A IA não conseguiu identificar a fase automaticamente ou você optou por alterar.
						</p>
					</header>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
						<button
							onClick={() => {
								setFormData((prev) => ({ ...prev, defenseType: "previa" }));
								navigate("/upload/form");
							}}
							className="bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-yellow-400 transition-all text-left group hover:shadow-md h-full flex flex-col">
							<div className="bg-yellow-100 w-12 h-12 rounded-xl flex items-center justify-center text-yellow-600 mb-4 group-hover:scale-110 transition-transform">
								<FileWarning size={24} />
							</div>
							<h3 className="font-bold text-lg text-gray-800 mb-2">Defesa Prévia</h3>
							<p className="text-sm text-gray-500 leading-relaxed">
								Recebi a <strong>Notificação de Autuação</strong> (sem código de barras). Quero
								apontar erros formais antes da penalidade.
							</p>
						</button>
						<button
							onClick={() => {
								setFormData((prev) => ({ ...prev, defenseType: "jari" }));
								navigate("/upload/form");
							}}
							className="bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-blue-500 transition-all text-left group hover:shadow-md h-full flex flex-col">
							<div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
								<Gavel size={24} />
							</div>
							<h3 className="font-bold text-lg text-gray-800 mb-2">Recurso JARI</h3>
							<p className="text-sm text-gray-500 leading-relaxed">
								Recebi a <strong>Notificação de Penalidade</strong> (com boleto/valor). Quero
								contestar o mérito e cancelar a multa.
							</p>
						</button>
						<button
							onClick={() => {
								setFormData((prev) => ({ ...prev, defenseType: "cetran" }));
								navigate("/upload/form");
							}}
							className="bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-purple-500 transition-all text-left group hover:shadow-md h-full flex flex-col">
							<div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
								<Scale size={24} />
							</div>
							<h3 className="font-bold text-lg text-gray-800 mb-2">CETRAN</h3>
							<p className="text-sm text-gray-500 leading-relaxed">
								Meu recurso à JARI foi <strong>negado/indeferido</strong>. Quero recorrer à última
								instância administrativa.
							</p>
						</button>
					</div>

					<div className="text-center">
						<button
							onClick={() => setShowHelpModal(true)}
							className="text-blue-600 font-bold flex items-center gap-2 mx-auto hover:underline">
							<HelpCircle size={20} /> Preciso de ajuda para identificar
						</button>
					</div>
				</div>
			</MainLayout>
		);
	}

	const HardBlockModal = () => {
		const timeLeft = hardBlockInfo ? Math.ceil((hardBlockInfo.expiresAt - Date.now()) / 60000) : 0;

		return (
			<div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in">
				<div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative p-8 text-center border-t-4 border-red-600">
					<div className="mb-6 flex justify-center">
						<div className="bg-red-100 p-4 rounded-full">
							<Lock size={40} className="text-red-600" />
						</div>
					</div>
					<h3 className="text-2xl font-black text-gray-900 mb-2">
						Acesso Temporariamente Bloqueado
					</h3>
					<p className="text-red-600 font-bold mb-4 bg-red-50 py-2 rounded-lg">
						{hardBlockInfo?.message || "Limite de segurança atingido."}
					</p>
					<p className="text-gray-600 mb-8 leading-relaxed">
						Você excedeu o limite de tentativas e bypass permitidos.
						<br />
						Para garantir a estabilidade do sistema, novas análises estão suspensas por:
						<br />
						<span className="text-3xl font-black text-gray-900 block mt-4">{timeLeft} minutos</span>
					</p>

					<button
						onClick={() => {
							setShowHardBlockModal(false);
							navigate("/");
						}}
						className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-colors shadow-lg">
						Voltar ao Início
					</button>
				</div>
			</div>
		);
	};

	if (step === "form") {
		return (
			<MainLayout>
				{showLimitModal && <LimitExceededModal />}
				{showLoginPrompt && <LoginPromptModal />}
				{showHardBlockModal && <HardBlockModal />}
				{showDivergenceModal && <DivergenceWarningModal />}
				{showCodeNotFoundModal && <CodeNotFoundModal />}
				<div className="max-w-5xl mx-auto py-8">
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
						<div className="mt-4 text-sm text-red-600 font-medium">* Campos obrigatórios</div>
					</header>

					<form
						onSubmit={handlePreAnalysis}
						className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
						{loading && (
							<div className="fixed inset-0 bg-white/80 z-[100] flex flex-col items-center justify-center p-4 text-center">
								<Loader2 size={60} className="text-blue-600 animate-spin mb-4" />
								<h2 className="text-2xl font-bold text-gray-800 mb-2">Processando Análise...</h2>
								<p className="text-gray-600 max-w-md font-bold">{loadingText}</p>
							</div>
						)}

						<section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
							<div className="flex items-center gap-2 border-b pb-4">
								<User className="text-blue-600" />
								<h3 className="text-xl font-bold text-gray-800">1. Qualificação</h3>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
								<div className="md:col-span-2">
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
								<div>
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
								<div>
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
								<div>
									<label className="label-form">
										Órgão Emissor <span className="text-red-500">*</span>
									</label>
									<input
										name="rgIssuer"
										value={formData.rgIssuer}
										onChange={handleChange}
										onBlur={handleBlur}
										className={`input-form ${errors.rgIssuer ? "border-red-500" : ""}`}
										required
									/>
									{errors.rgIssuer && (
										<p className="text-red-500 text-xs mt-1">{errors.rgIssuer}</p>
									)}
								</div>
								<div>
									<label className="label-form">
										Nacionalidade <span className="text-red-500">*</span>
									</label>
									<input
										name="nationality"
										value={formData.nationality}
										onChange={handleChange}
										onBlur={handleBlur}
										className={`input-form ${errors.nationality ? "border-red-500" : ""}`}
										required
									/>
									{errors.nationality && (
										<p className="text-red-500 text-xs mt-1">{errors.nationality}</p>
									)}
								</div>
								<div>
									<label className="label-form">
										Estado Civil <span className="text-red-500">*</span>
									</label>
									<select
										name="maritalStatus"
										value={formData.maritalStatus}
										onChange={handleChange}
										onBlur={handleBlur}
										className={`input-form ${errors.maritalStatus ? "border-red-500" : ""}`}
										required>
										<option value="">Selecione...</option>
										<option value="Solteiro(a)">Solteiro(a)</option>
										<option value="Casado(a)">Casado(a)</option>
										<option value="Divorciado(a)">Divorciado(a)</option>
										<option value="Viúvo(a)">Viúvo(a)</option>
										<option value="Outro">Outro</option>
									</select>
									{errors.maritalStatus && (
										<p className="text-red-500 text-xs mt-1">{errors.maritalStatus}</p>
									)}
								</div>
								<div>
									<label className="label-form">Profissão</label>
									<input
										name="profession"
										value={formData.profession}
										onChange={handleChange}
										onBlur={handleBlur}
										className="input-form"
									/>
								</div>
								<div>
									<label className="label-form">
										CNH <span className="text-red-500">*</span>
									</label>
									<input
										name="cnh"
										value={formData.cnh}
										onChange={handleChange}
										onBlur={handleBlur}
										className={`input-form ${errors.cnh ? "border-red-500" : ""}`}
										required
									/>
									{errors.cnh && <p className="text-red-500 text-xs mt-1">{errors.cnh}</p>}
								</div>
								<div>
									<label className="label-form">Categoria CNH</label>
									<input
										name="cnhCategory"
										value={formData.cnhCategory}
										onChange={handleChange}
										onBlur={handleBlur}
										className="input-form"
									/>
								</div>
								<div className="md:col-span-1">
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
								<div className="md:col-span-2">
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
							<div className="pt-4 border-t border-gray-100 mt-2">
								<h4 className="text-sm font-bold text-gray-500 mb-4 uppercase">
									Endereço Completo
								</h4>
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
										{errors.zipCode && (
											<p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
										)}
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
										{errors.address && (
											<p className="text-red-500 text-xs mt-1">{errors.address}</p>
										)}
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
										<input
											name="state"
											value={formData.state}
											onChange={handleChange}
											onBlur={handleBlur}
											className={`input-form ${errors.state ? "border-red-500" : ""}`}
											required
										/>
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
										UF Placa <span className="text-red-500">*</span>
									</label>
									<input
										name="plateUF"
										value={formData.plateUF}
										onChange={handleChange}
										onBlur={handleBlur}
										className={`input-form ${errors.plateUF ? "border-red-500" : ""}`}
										required
									/>
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
							<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
								<div>
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
									{errors.aitNumber && (
										<p className="text-red-500 text-xs mt-1">{errors.aitNumber}</p>
									)}
								</div>
								<div className="flex gap-2 items-end">
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
									<div className="w-24">
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
											onClick={handleSearchCode}
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
								<div className="md:col-span-3">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
										<div>
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
														: "Aguardando preenchimento do Código da Infração..."
												}
											/>
										</div>
									</div>
									<p className="text-xs text-gray-500 mt-1">
										Preencha o Cód. Infração e clique na lupa para preencher automaticamente.
									</p>
								</div>{" "}
								<div className="md:col-span-3">
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
												: "Aguardando preenchimento do Código da Infração..."
										}
									/>
								</div>
								<div>
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
								<div>
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
								<div>
									<label className="label-form">
										Horário (24h) <span className="text-red-500">*</span>
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
								<div className="md:col-span-3">
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
									{errors.location && (
										<p className="text-red-500 text-xs mt-1">{errors.location}</p>
									)}
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
									{errors.signCity && (
										<p className="text-red-500 text-xs mt-1">{errors.signCity}</p>
									)}
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
									{errors.signDate && (
										<p className="text-red-500 text-xs mt-1">{errors.signDate}</p>
									)}
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
				</div>
				<style
					dangerouslySetInnerHTML={{
						__html: `.input-form { width: 100%; padding: 0.875rem; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.75rem; } .label-form { font-size: 0.875rem; font-weight: 500; color: #374151; display: block; margin-bottom: 0.25rem; }`,
					}}
				/>
			</MainLayout>
		);
	}

	return (
		<MainLayout>
			<SEO
				title="Focado em Análise de Multa por Foto"
				description="Envie a foto da sua notificação de autuação e nossa IA extrairá os dados e analisará a viabilidade do recurso gratuitamente."
				keywords="analise multa foto, ocr multa, recurso ia, defesa transito"
			/>
			{showLimitModal && <LimitExceededModal />}
			{showLoginPrompt && <LoginPromptModal />}
			{showHardBlockModal && <HardBlockModal />}
			<div className="max-w-3xl mx-auto py-10">
				<div className="mb-8 text-center">
					<Link
						to="/"
						className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors">
						<ArrowLeft size={20} className="mr-1" /> Início
					</Link>
					<h1 className="text-3xl font-bold text-gray-900">Análise de Documento</h1>
					<p className="text-gray-500 mt-2">
						Envie a foto da multa. A IA irá preencher os dados para você.
					</p>
				</div>
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
					<div className="p-6 md:p-10">
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
							className="space-y-8">
							<div
								className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer min-h-[300px] relative ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50"} ${file ? "border-blue-500 bg-blue-50/30" : ""}`}
								onDragOver={handleDragOver}
								onDragLeave={handleDragLeave}
								onDrop={handleDrop}>
								{!file ? (
									<label className="w-full h-full absolute inset-0 flex flex-col items-center justify-center cursor-pointer z-10">
										<div className="bg-white p-4 rounded-full shadow-sm mb-4">
											<UploadCloud size={40} className="text-blue-600" />
										</div>
										<span className="font-semibold text-lg text-gray-700">
											Clique ou arraste aqui
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
											className="text-gray-400 hover:text-red-500 transition-colors p-2">
											<X size={20} />
										</button>
									</div>
								)}
							</div>
							<div className="flex justify-center pt-4 border-t border-gray-100">
								<button
									type="submit"
									disabled={!file || loading || (currentUser && !currentUser.emailVerified)}
									title={
										currentUser && !currentUser.emailVerified
											? "Confirme seu email para utilizar"
											: ""
									}
									className={`px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all w-full md:w-auto ${file && !loading && (!currentUser || currentUser.emailVerified) ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}>
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
					</div>
					<div className="bg-gray-50 p-6 text-center border-t border-gray-100">
						<p className="text-gray-500 text-sm mb-2">Não tem arquivo ou foto da infração?</p>
						{currentUser && !currentUser.emailVerified ? (
							<button
								disabled
								className="text-gray-400 font-bold flex items-center justify-center gap-1 cursor-not-allowed"
								title="Confirme seu email para utilizar">
								<FileText size={16} /> Inserir dados manualmente
							</button>
						) : (
							<Link
								to="/manual-defense"
								className="text-blue-600 font-bold hover:underline flex items-center justify-center gap-1">
								<FileText size={16} /> Inserir dados manualmente
							</Link>
						)}
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default UploadDefense;