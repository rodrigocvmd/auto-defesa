import { useState } from 'react';
import { api } from '../../../services/api';

export const usePdfGenerator = (componentRef, formData, setShowDownloadSuccess) => {
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");

    const handleGeneratePDF = async () => {
        // Obter o conteúdo HTML do editor Quill
        // .ql-editor contém o HTML "limpo" do conteúdo editável
        const sourceElement = componentRef.current.querySelector('.ql-editor');
        
        if (!sourceElement) {
            alert("Erro: Conteúdo não encontrado para gerar PDF.");
            return false;
        }

        const htmlContent = sourceElement.innerHTML;
        
        const defenseType = (formData.defenseType || "").toLowerCase();
        let typeStr = "Defesa_Previa";
        if (defenseType.includes("jari")) typeStr = "Recurso_JARI";
        else if (defenseType.includes("cetran") || defenseType.includes("contradife")) typeStr = "Recurso_CETRAN";

        const firstName = (formData.name || "Usuario").trim().split(" ")[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const cleanPlate = (formData.plate || "Placa").replace(/[^a-zA-Z0-9]/g, "");

        const fileName = `${typeStr}_${firstName}_${cleanPlate}.pdf`;

        try {
            setLoading(true);
            setLoadingText("Gerando seu arquivo PDF profissional no servidor...");
            
            // Chama o backend para gerar o PDF
            const blob = await api.generatePdf(htmlContent, fileName);
            
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
            alert("Ocorreu um erro ao gerar o PDF. O servidor pode estar ocupado. Tente novamente.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { handleGeneratePDF, loading, loadingText };
};