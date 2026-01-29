import { useState } from 'react';
import html2pdf from 'html2pdf.js';

export const usePdfGenerator = (componentRef, formData, setShowDownloadSuccess) => {
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");

    const handleGeneratePDF = async () => {
        const sourceElement = componentRef.current.querySelector('.ql-editor');
        
        // Criar um wrapper para o conteúdo
        // Usamos 170mm de largura pois o A4 tem 210mm e as margens laterais somam 40mm
        const worker = document.createElement('div');
        worker.style.width = '170mm';
        worker.style.background = 'white';
        worker.style.boxSizing = 'border-box';
        
        // Clonar o conteúdo
        const content = document.createElement('div');
        content.innerHTML = sourceElement.innerHTML;
        
        // Aplicar estilos base no content
        content.style.fontFamily = '"Times New Roman", Times, serif';
        content.style.fontSize = '12pt';
        content.style.lineHeight = '1.5';
        content.style.color = 'black';
        content.style.textAlign = 'justify';

        // Converter classes do Quill para estilos inline (crucial para alinhamento)
        content.querySelectorAll('*').forEach(el => {
            if (el.classList.contains('ql-align-center')) el.style.textAlign = 'center';
            if (el.classList.contains('ql-align-right')) el.style.textAlign = 'right';
            if (el.classList.contains('ql-align-justify')) el.style.textAlign = 'justify';
            
            if (el.tagName === 'H3') {
                el.style.textAlign = 'center';
                el.style.fontWeight = 'bold';
                el.style.fontSize = '14pt';
                el.style.marginTop = '20px';
                el.style.marginBottom = '10px';
            }
            if (el.tagName === 'P') {
                el.style.marginBottom = '10px';
            }
        });

        worker.appendChild(content);

        const opt = {
            margin:       [20, 20, 20, 20], // Topo, Esquerda, Fundo, Direita
            filename:     `Recurso_${formData.plate || "Final"}.pdf`,
            image:        { type: 'jpeg', quality: 1 },
            html2canvas:  { 
                scale: 3, 
                useCORS: true, 
                letterRendering: true,
                logging: false
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
        };

        try {
            setLoading(true);
            setLoadingText("Gerando seu arquivo PDF profissional...");
            
            await html2pdf().set(opt).from(worker).save();
            
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
