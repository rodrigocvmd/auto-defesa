import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useDefense } from '../../../contexts/DefenseContext';
import { api } from '../../../services/api';
import { rateLimiter } from '../../../services/rateLimiter';
import { formatDefenseToHtml } from '../../../utils/textToHtml';
import { db } from '../../../firebaseConfig';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

export const useDefenseLogic = (step) => {
    const { currentUser, userData } = useAuth();
    const navigate = useNavigate();
    
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
        resetDefense,
        initialFormState
    } = useDefense();

    // Local State
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingCep, setLoadingCep] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const [searchingCode, setSearchingCode] = useState(false);
    const [isTestMode, setIsTestMode] = useState(false);
    const [hasTested, setHasTested] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);
    
    // Refinement State
    const [isRefining, setIsRefining] = useState(false);
    const [refinementText, setRefinementText] = useState("");
    const [refining, setRefining] = useState(false);
    const [refinementCount, setRefinementCount] = useState(5);

    // Hard Block State
    const [showHardBlockModal, setShowHardBlockModal] = useState(false);
    const [hardBlockInfo, setHardBlockInfo] = useState(null);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [consecutiveDivergenceCount, setConsecutiveDivergenceCount] = useState(0);
    const [showDivergenceModal, setShowDivergenceModal] = useState(false);

    // Default defense type
    useEffect(() => {
        if (!formData.defenseType) {
            setFormData(prev => ({ ...prev, defenseType: "Análise de Upload" }));
        }
    }, []);

    // Reset state if user navigates back to start
    useEffect(() => {
        if (step === "upload" && result) {
            resetDefense();
        }
    }, [step, result, resetDefense]);

    // Restore pending data
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
            value = value.replace(/\D/g, "").slice(0, 7);
            if (value.length === 7) {
                value = value.replace(/(\d{1})(\d{3})(\d{3})/, "$1.$2.$3");
            } else if (value.length > 3) {
                value = value.replace(/(\d{3})(\d+)/, "$1.$2");
            }
        }
        if (name === "zipCode") {
            value = value.replace(/\D/g, "").slice(0, 8);
            if (value.length > 5) {
                value = `${value.slice(0, 5)}-${value.slice(5)}`;
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
            "name", "cpf", "rg", "nationality", "maritalStatus", "cnh", "phone", "email",
            "zipCode", "address", "addressNumber", "neighborhood", "city", "state",
            "plate", "plateUF", "vehicleModel", "aitNumber", "infractionCode", "issuingBody",
            "date", "time", "location", "description", "equipmentNumber", "lastCalibration",
            "signCity", "signDate",
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
                case "zipCode":
                    if (value.length < 9) error = "CEP incompleto (XXXXX-XXX).";
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

    const handleBlur = (e) => {
        const { name, value } = e.target;
        if (name === "zipCode") handleCepBlur(e);
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

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

    const handleUploadAndExtract = async (bypass = false) => {
        if (!file) return;

        const isAnonymous = !currentUser;
        if (bypass) {
            await rateLimiter.recordBypass("upload_analysis", currentUser);
        }

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
            const response = await api.extractData(base64, file.type);

            await rateLimiter.recordUsage("upload_analysis", currentUser);

            if (response.success) {
                let extractedData = response.data;

                if (extractedData.infractionCode) {
                    try {
                        const infractionRes = await api.getInfraction({
                            code: extractedData.infractionCode,
                            desdobramento: extractedData.infractionSplit,
                        });
                        if (infractionRes && infractionRes.success) {
                            if (infractionRes.data.article) extractedData.article = infractionRes.data.article;
                            if (infractionRes.data.description)
                                extractedData.infractionDescription = infractionRes.data.description;
                            if (infractionRes.data.legalText)
                                extractedData.legalText = infractionRes.data.legalText;
                            else if (infractionRes.data.description)
                                extractedData.legalText = infractionRes.data.description;
                        }
                    } catch (ignore) {
                        console.log("Failed to auto-fetch article from code", ignore);
                    }
                }

                const { description: ocrDescription, ...otherData } = extractedData;

                setFormData((prev) => ({
                    ...prev,
                    ...otherData,
                    equipmentNumber: otherData.equipmentNumber || "Não disponível",
                    lastCalibration: otherData.lastCalibration || "Não disponível",
                    infractionDescription:
                        ocrDescription || extractedData.infractionDescription || prev.infractionDescription,
                    legalText: extractedData.legalText || ocrDescription || prev.legalText,
                    nationality: extractedData.nationality || prev.nationality,
                    signDate: extractedData.signDate || prev.signDate,
                    description: prev.description,
                }));

                if (extractedData.defensePhase) {
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
            setTimeout(() => navigate("/upload/phaseSelection"), 2000);
        } finally {
            setLoading(false);
        }
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

    const handlePreAnalysis = async (e, bypass = false) => {
        if (e) e.preventDefault();

        const isAnonymous = !currentUser;
        if (bypass) {
            await rateLimiter.recordBypass("upload_case_analysis", currentUser);
        }

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
        if (isTestMode) return;
        setLoading(true);
        try {
            const response = await api.generateDefense({ ...formData, userId: currentUser?.uid });
            if (response.success) {
                const formattedText = formatDefenseToHtml(response.data.defenseText);
                setResult(formattedText);
                if (currentUser) {
                    try {
                        const docRef = await addDoc(collection(db, "defenses"), {
                            userId: currentUser.uid,
                            infractionType: "Análise de Upload",
                            licensePlate: formData.plate,
                            defenseText: formattedText,
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
                const newText = formatDefenseToHtml(response.data.defenseText);
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
    
    // Test Mode Logic
    const confirmTestMode = () => {
        setFormData({
            ...initialFormState,
            name: "João da Silva",
            nationality: "Brasileiro",
            maritalStatus: "Solteiro(a)",
            profession: "Motorista",
            rg: "1.234.567",
            rgIssuer: "SSP/SP",
            cpf: "069.268.226-03",
            cnh: "12345678900",
            cnhCategory: "B",
            address: "Av. Paulista",
            addressNumber: "1000",
            addressComplement: "Apto 10",
            neighborhood: "Bela Vista",
            city: "São Paulo",
            state: "SP",
            zipCode: "01310-100",
            phone: "(11) 99999-9999",
            email: "joao@email.com",
            plate: "ABC-1234",
            plateUF: "SP",
            vehicleModel: "Fiat Gol",
            issuingBody: "DETRAN-SP",
            aitNumber: "A012345678",
            date: "01/01/2024",
            time: "14:30",
            location: "Av. Paulista, 1000",
            infractionCode: "7455",
            infractionSplit: "0",
            article: "Art. 218, I, CTB",
            infractionDescription: "Transitar em velocidade superior à máxima permitida em até 20%",
            legalText: "Transitar em velocidade superior à máxima permitida para o local...",
            description: "O sinal estava encoberto por uma árvore e não havia sinalização visível...",
            equipmentNumber: "12345678",
            lastCalibration: "10/10/2023",
            signCity: "São Paulo",
            signDate: "01/01/2024",
            defenseType: formData.defenseType || "previa"
        });
        setIsTestMode(true);
        setHasTested(true);
        setErrors({});
    };

    const handleReturnToRealData = () => {
        resetDefense();
        setIsTestMode(false);
        setHasTested(true);
        navigate("/upload");
        window.scrollTo({ top: 0, behavior: "smooth" });
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
                    legalText: legalText || description || prev.legalText,
                }));
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        } finally {
            setSearchingCode(false);
        }
    };
    
    // Automatically update signCity if city changes
    useEffect(() => {
        if (formData.city && !formData.signCity) {
            setFormData((prev) => ({ ...prev, signCity: prev.city }));
        }
    }, [formData.city]);

    return {
        formData, setFormData,
        file, setFile,
        loading, setLoading,
        error, setError,
        errors, setErrors,
        loadingCep, setLoadingCep,
        searchingCode,
        isTestMode, setIsTestMode,
        hasTested, setHasTested,
        analysisData,
        result, setResult,
        defenseId, setDefenseId,
        handleUploadAndExtract,
        handlePreAnalysis,
        handleUnlockDefense,
        confirmTestMode,
        handleReturnToRealData,
        handleSearchCode,
        handleChange,
        handleBlur,
        isRefining, setIsRefining,
        refinementText, setRefinementText,
        refining, setRefining,
        refinementCount, setRefinementCount,
        handleRefinementSubmit,
        saveDefenseToHistory,
        showHardBlockModal, setShowHardBlockModal,
        hardBlockInfo, setHardBlockInfo,
        showLoginPrompt, setShowLoginPrompt,
        showLimitModal, setShowLimitModal,
        showDivergenceModal, setShowDivergenceModal,
        showHelpModal, setShowHelpModal,
        resetDefense
    };
};