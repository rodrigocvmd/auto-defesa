import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import DefenseDocument from '../../../components/DefensePDF';
import { formatDefenseToHtml } from '../../../utils/textToHtml';
import { api } from '../../../services/api';

export const usePdfGenerator = (htmlContent, formData, setShowDownloadSuccess) => {
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const [emailSuccess, setEmailSuccess] = useState(false);

    const getFileInfo = () => {
        const defenseType = (formData.defenseType || "").toLowerCase();
        let typeStr = "Defesa_Previa";
        if (defenseType.includes("jari")) typeStr = "Recurso_JARI";
        else if (defenseType.includes("cetran") || defenseType.includes("contradife")) typeStr = "Recurso_CETRAN";

        const firstName = (formData.name || "Usuario").trim().split(" ")[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const cleanPlate = (formData.plate || "Placa").replace(/[^a-zA-Z0-9]/g, "");

        return `${typeStr}_${firstName}_${cleanPlate}.pdf`;
    };

    const handleGeneratePDF = async () => {
        if (!htmlContent) {
            alert("Erro: Conteúdo não encontrado para gerar PDF.");
            return false;
        }

        const finalHtml = formatDefenseToHtml(htmlContent);
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

    const handleSendEmail = async () => {
        if (!htmlContent) {
            alert("Erro: Conteúdo não encontrado para gerar PDF.");
            return false;
        }

        const finalHtml = formatDefenseToHtml(htmlContent);
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

            await api.sendDefensePdfEmail(base64data, fileName);
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