import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import DefenseDocument from '../../../components/DefensePDF';
import { formatDefenseToHtml } from '../../../utils/textToHtml';
import { api } from '../../../services/api';

export const usePdfGenerator = (htmlContent, formData, setShowDownloadSuccess) => {
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const [emailSuccess, setEmailSuccess] = useState(false);

    const injectPII = (html, pii) => {
        if (!pii) return html;
        let processed = html;

        const mappings = [
            { label: "CPF", val: pii.idPrimary, fallback: "_______________________" },
            { label: "RG", val: pii.idSecondary, fallback: "_______________________" },
            { label: "CNH", val: pii.driverReg, fallback: "_______________________" },
            { label: "CEP", val: pii.locZip, fallback: "________-___" },
            { label: "Bairro", val: pii.locNeighb, fallback: "_______________________" },
            { label: "Cidade", val: pii.locCity, fallback: "_______________________" },
            { label: "UF", val: pii.locState, fallback: "____" },
            { label: "Logradouro", val: pii.locStreet, fallback: "_______________________" },
            { label: "Endereço", val: pii.locStreet, fallback: "_______________________" },
            { label: "Nº", val: pii.locNum, fallback: "____" },
            { label: "Número", val: pii.locNum, fallback: "____" },
        ];

        mappings.forEach(({ label, val, fallback }) => {
            const value = val || fallback;
            // Regex matches "LABEL: [any common placeholder]" or just "LABEL:" if followed by space/line break
            // Includes support for bold tags etc.
            const regex = new RegExp(`(${label}:?\\s*)(?:<u>.*?<\\/u>|<strong>.*?<\\/strong>|\\[.*?\\]|\\(.*?\\)|_{3,}|\\.{3,}|\\s*)(?=\\s|,|\\.|<|$)`, "gi");
            processed = processed.replace(regex, `$1${value}`);
        });

        return processed;
    };

    const getFileInfo = () => {
        const defenseType = (formData.defenseType || "").toLowerCase();
        let typeStr = "Defesa_Previa";
        if (defenseType.includes("jari")) typeStr = "Recurso_JARI";
        else if (defenseType.includes("cetran") || defenseType.includes("contradife")) typeStr = "Recurso_CETRAN";

        const firstName = (formData.name || "Usuario").trim().split(" ")[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const cleanPlate = (formData.plate || "Placa").replace(/[^a-zA-Z0-9]/g, "");

        return `${typeStr}_${firstName}_${cleanPlate}.pdf`;
    };

    const handleGeneratePDF = async (piiData = null) => {
        if (!htmlContent) {
            alert("Erro: Conteúdo não encontrado para gerar PDF.");
            return false;
        }

        let finalHtml = formatDefenseToHtml(htmlContent);
        if (piiData) {
            finalHtml = injectPII(finalHtml, piiData);
        }

        const fileName = getFileInfo();

        try {
            setLoading(true);
            setLoadingText("Gerando seu PDF profissional instantaneamente...");
            
            const blob = await pdf(React.createElement(DefenseDocument, { content: finalHtml })).toBlob();
            
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            if (setShowDownloadSuccess) setShowDownloadSuccess(true);
            return true;
        } catch (err) {
            console.error("Erro ao gerar PDF:", err);
            alert("Ocorreu um erro ao gerar o PDF. Tente novamente.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleSendEmail = async (piiData = null) => {
        if (!htmlContent) {
            alert("Erro: Conteúdo não encontrado para gerar PDF.");
            return false;
        }

        let finalHtml = formatDefenseToHtml(htmlContent);
        if (piiData) {
            finalHtml = injectPII(finalHtml, piiData);
        }
        
        const fileName = getFileInfo();

        try {
            setLoading(true);
            setLoadingText("Preparando PDF e enviando para seu email...");
            
            const blob = await pdf(React.createElement(DefenseDocument, { content: finalHtml })).toBlob();
            
            // Convert Blob to Base64
            const reader = new FileReader();
            const base64Promise = new Promise((resolve, reject) => {
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
            });
            reader.readAsDataURL(blob);
            const base64data = await base64Promise;

            const guestEmail = localStorage.getItem("guestEmail");
            await api.sendDefensePdfEmail(base64data, fileName, guestEmail);
            setEmailSuccess(true);
            return true;
        } catch (err) {
            console.error("Erro ao enviar PDF por email:", err);
            alert("Ocorreu um erro ao enviar o email. Tente novamente.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { handleGeneratePDF, handleSendEmail, loading, loadingText, emailSuccess };
};