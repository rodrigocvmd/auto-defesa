import React, { createContext, useContext, useState, useEffect } from "react";

const DefenseContext = createContext();

export const useDefense = () => useContext(DefenseContext);

export const DefenseProvider = ({ children }) => {
	// Estado inicial para o formulário
	const initialFormState = {
		defenseType: "",
		name: "",
		nationality: "Brasileiro(a)",
		maritalStatus: "",
		profession: "",
		rg: "",
		rgIssuer: "",
		cpf: "",
		cnh: "",
		cnhCategory: "",
		address: "",
		addressNumber: "",
		addressComplement: "",
		neighborhood: "",
		city: "",
		state: "",
		zipCode: "",
		phone: "",
		email: "",
		preferredTreatment: "",
		plate: "",
		plateUF: "",
		vehicleModel: "",
		issuingBody: "",
		aitNumber: "",
		date: "",
		time: "",
		location: "",
		infractionCode: "",
		infractionSplit: "",
		article: "",
		infractionDescription: "",
		legalText: "",
		description: "",
		equipmentNumber: "",
		lastCalibration: "",
		signCity: "",
		signDate: new Date().toLocaleDateString("pt-BR"),
	};

	// Helper para carregar do LocalStorage
	const loadState = (key, defaultValue) => {
		try {
			const saved = localStorage.getItem(key);
			return saved ? JSON.parse(saved) : defaultValue;
		} catch (e) {
			console.error(`Erro ao carregar ${key}`, e);
			return defaultValue;
		}
	};

	// Estados Principais (Inicializados do LocalStorage ou Default)
	const [formData, setFormData] = useState(() =>
		loadState("defense_formData", initialFormState)
	);
	const [analysisData, setAnalysisData] = useState(() =>
		loadState("defense_analysisData", null)
	);
	const [defenseResult, setDefenseResult] = useState(() =>
		loadState("defense_result", null)
	);
	const [defenseId, setDefenseId] = useState(() => 
		loadState("defense_id", null)
	);

	// Persistência automática: Salva no LocalStorage sempre que mudar
	useEffect(() => {
		localStorage.setItem("defense_formData", JSON.stringify(formData));
	}, [formData]);

	useEffect(() => {
		if (analysisData) {
			localStorage.setItem("defense_analysisData", JSON.stringify(analysisData));
		} else {
			localStorage.removeItem("defense_analysisData");
		}
	}, [analysisData]);

	useEffect(() => {
		if (defenseResult) {
			localStorage.setItem("defense_result", JSON.stringify(defenseResult));
		} else {
			localStorage.removeItem("defense_result");
		}
	}, [defenseResult]);

	useEffect(() => {
		if (defenseId) {
			localStorage.setItem("defense_id", JSON.stringify(defenseId));
		} else {
			localStorage.removeItem("defense_id");
		}
	}, [defenseId]);

	// Função para Resetar Tudo (ex: ao começar do zero)
	const resetDefense = () => {
		setFormData(initialFormState);
		setAnalysisData(null);
		setDefenseResult(null);
		setDefenseId(null);
		localStorage.removeItem("defense_formData");
		localStorage.removeItem("defense_analysisData");
		localStorage.removeItem("defense_result");
		localStorage.removeItem("defense_id");
	};

	// Valores expostos
	const value = {
		formData,
		setFormData,
		analysisData,
		setAnalysisData,
		defenseResult,
		setDefenseResult,
		defenseId,
		setDefenseId,
		resetDefense,
		initialFormState
	};

	return (
		<DefenseContext.Provider value={value}>
			{children}
		</DefenseContext.Provider>
	);
};
