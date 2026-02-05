import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import DefenseDocument from '../../../components/DefensePDF';
import { formatDefenseToHtml } from '../../../utils/textToHtml';

export const usePdfGenerator = (htmlContent, formData, setShowDownloadSuccess) => {
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");

    const handleGeneratePDF = async () => {
        if (!htmlContent) {
            alert("Erro: Conteúdo não encontrado para gerar PDF.");
            return false;
        }

        // Sempre formatamos para garantir que o wrapper HTML/CSS completo seja aplicado,
        // igual ao que é feito na página de perfil (histórico).
        const finalHtml = formatDefenseToHtml(htmlContent);
        
        const defenseType = (formData.defenseType || "").toLowerCase();
        let typeStr = "Defesa_Previa";
        if (defenseType.includes("jari")) typeStr = "Recurso_JARI";
        else if (defenseType.includes("cetran") || defenseType.includes("contradife")) typeStr = "Recurso_CETRAN";

        const firstName = (formData.name || "Usuario").trim().split(" ")[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const cleanPlate = (formData.plate || "Placa").replace(/[^a-zA-Z0-9]/g, "");

        const fileName = `${typeStr}_${firstName}_${cleanPlate}.pdf`;

        try {
            setLoading(true);
            setLoadingText("Gerando seu PDF profissional instantaneamente...");
            
            // Gera o PDF no cliente usando @react-pdf/renderer
            const blob = await pdf(React.createElement(DefenseDocument, { content: finalHtml })).toBlob();
            
            // Cria um link temporário para download do Blob
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            
            // Limpeza
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

    return { handleGeneratePDF, loading, loadingText };
};