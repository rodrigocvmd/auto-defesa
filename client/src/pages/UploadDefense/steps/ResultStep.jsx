import React, { useRef, useState } from "react";
import {
	ArrowLeft,
	CheckCircle,
	Download,
	PenTool,
	Loader2,
	AlertCircle,
	Info,
	Send,
	Lock,
} from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import printJS from "print-js";

import { usePdfGenerator } from "../hooks/usePdfGenerator";
import { EditWarningModal } from "../components/modals/EditWarningModal";
import { PrintInstructionModal } from "../components/modals/PrintInstructionModal";
import { DownloadConfirmModal } from "../components/modals/DownloadConfirmModal";
import { DownloadSuccessModal } from "../components/modals/DownloadSuccessModal";

export const ResultStep = ({
	result,
	formData,
	isRefining,
	setIsRefining,
	refinementText,
	setRefinementText,
	handleRefinementSubmit,
	refining,
	refinementCount,
	saveDefenseToHistory,
	loadingText,
	loading,
}) => {
	const navigate = useNavigate();
	const componentRef = useRef();
	const [showEditWarning, setShowEditWarning] = useState(false);
	const [isEditing, setIsEditing] = useState(true); // Default to true or controlled? Original was default true but had logic.
	// Actually in original: const [isEditing, setIsEditing] = useState(true);

	const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
	const [showDownloadSuccess, setShowDownloadSuccess] = useState(false);
	const [showPrintInstructionModal, setShowPrintInstructionModal] = useState(false);
	const [showProfileButton, setShowProfileButton] = useState(false);

	const { handleGeneratePDF, loading: pdfLoading } = usePdfGenerator(
		componentRef,
		formData,
		null // Não mostramos o modal aqui, redirecionamos para o perfil
	);

	const handleDownloadRequest = () => {
		setShowDownloadConfirm(true);
	};

	const handleConfirmDownload = async () => {
		setShowDownloadConfirm(false);
		const success = await handleGeneratePDF();
		if (success) {
			navigate("/profile", { state: { downloadStarted: true } });
		}
	};

	const handleFinalizePDF = async () => {
		const originalElement = document.getElementById("defense-preview-content"); // Need to ensure ID exists
		if (!originalElement) {
			// alert("Erro: Visualização não encontrada.");
			// Actually we use componentRef in the hook, so maybe this is for printJS?
			// printJS uses 'defense-preview-content' ID.
		}
		setShowPrintInstructionModal(true);
	};

	const executePrint = () => {
		setShowPrintInstructionModal(false);
		try {
			printJS({
				printable: "defense-preview-content", // We need to add this ID to the container
				type: "html",
				targetStyles: [
					"font-family",
					"font-size",
					"font-weight",
					"font-style",
					"color",
					"background-color",
					"text-align",
					"text-indent",
					"line-height",
					"text-decoration",
					"margin",
					"padding",
					"border",
					"list-style-type",
					"list-style-position",
				],
				style: `
                    @media print {
                        @page { size: A4 portrait; margin: 20mm !important; }
                        body { margin: 0; padding: 0; background-color: white; }
                        #defense-preview-content { 
                            width: 100% !important;
                            max-width: 100% !important;
                            margin: 0 !important; 
                            padding: 0 !important;
                            position: static !important;
                            overflow: visible !important;
                            box-shadow: none !important;
                            border: none !important;
                            box-sizing: border-box !important;
                            background-color: white !important;
                        }
                        .ql-editor {
                            width: 100% !important;
                            box-sizing: border-box !important;
                            padding: 0 !important; /* Margins handled by @page */
                            min-height: auto !important;
                            height: auto !important;
                            overflow: visible !important;
                            white-space: pre-wrap !important;
                        }
                        h1, h2, h3, h4, h5, h6 { page-break-after: avoid; }
                        p { orphans: 2; widows: 2; }
                        
                        /* Fix Alignment */
                        .ql-align-center { text-align: center !important; }
                        .ql-align-right { text-align: right !important; }
                        .ql-align-justify { text-align: justify !important; }
                    }
                `,
				documentTitle: `Recurso_${formData.plate || "Final"}`,
				onPrintDialogClose: () => {
					setShowProfileButton(true);
				},
			});
		} catch (err) {
			console.error("Erro ao iniciar impressão:", err);
			alert("Ocorreu um erro. Tente novamente.");
		}
	};

	return (
		<div className="max-w-6xl mx-auto py-8">
			{showEditWarning && (
				<EditWarningModal
					onClose={() => setShowEditWarning(false)}
					onConfirm={() => {
						setShowEditWarning(false);
						setIsEditing(true);
					}}
				/>
			)}
			{showDownloadConfirm && (
				<DownloadConfirmModal
					onClose={() => setShowDownloadConfirm(false)}
					onConfirm={handleConfirmDownload}
				/>
			)}
			{showDownloadSuccess && (
				<DownloadSuccessModal onClose={() => setShowDownloadSuccess(false)} />
			)}
			{showPrintInstructionModal && (
				<PrintInstructionModal
					onClose={() => setShowPrintInstructionModal(false)}
					onPrint={executePrint}
				/>
			)}

			{loading && (
				<div className="fixed inset-0 bg-white/90 z-[100] flex flex-col items-center justify-center p-4 text-center backdrop-blur-sm animate-in fade-in duration-300">
					<Loader2 size={60} className="text-blue-600 animate-spin mb-4" />
					<h2 className="text-2xl font-black text-gray-900 mb-2">Construindo sua Defesa...</h2>
					<p className="text-gray-600 max-w-md font-bold">{loadingText || "Processando..."}</p>
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

			<div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-200 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 animate-in slide-in-from-top-4">
				<div>
					<h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
						<CheckCircle className="text-green-500" /> Revisão Final
					</h2>
					<p className="text-md text-gray-500">
						Leia atentamente; use a IA para correções; baixe quando pronto.
					</p>
				</div>

				<div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
					<button
						onClick={() => setIsRefining(!isRefining)}
						disabled={refining}
						className={`px-6 py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
							isRefining
								? "bg-gray-100 text-gray-600 border border-gray-300"
								: "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 shadow-md animate-pulse"
						}`}>
						{refining ? <Loader2 className="animate-spin" size={18} /> : <PenTool size={18} />}
						{isRefining ? "Fechar Painel de Correção" : "Solicitar Correção via IA"}
					</button>

					<button
						onClick={handleDownloadRequest}
						className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 flex items-center justify-center gap-2 shadow-md">
						<Download size={18} /> Baixar PDF Final
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
				<div
					className={`${isRefining ? "lg:col-span-8" : "lg:col-span-12"} order-2 lg:order-1 transition-all duration-300`}>
					<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg flex gap-3 items-start">
						<AlertCircle className="text-yellow-600 shrink-0 mt-0.5" size={20} />
						<div>
							<h4 className="font-bold text-yellow-800 text-sm">Modo de Conferência e Edição</h4>
							<p className="text-yellow-700 text-sm mt-1">
								Leia todo o conteúdo. Se, porventura, encontrar nomes errados, datas incorretas ou
								argumentos indesejados, use o botão <strong>"Solicitar Correção via IA"</strong>.
							</p>
						</div>
					</div>

					<div className="flex justify-center bg-gray-200/80 py-8 rounded-xl border border-gray-200 overflow-hidden relative min-h-screen">
						<div ref={componentRef} id="defense-preview-content" className="print-content">
							<style>{`
                                /* Estilos do Documento A4 na Tela */
                                .ql-container.ql-snow { border: none !important; }
                                /* ESCONDER TOOLBAR TOTALMENTE - MODO LEITURA */
                                .ql-toolbar.ql-snow { 
                                    display: none !important;
                                }
                                
                                /* O Papel A4 */
                                .ql-editor {
                                    width: 210mm;
                                    min-height: 297mm;
                                    background-color: white;
                                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                                    margin: 0 auto;
                                    padding: 20mm !important; /* Margens A4 Padrão */
                                    
                                    /* Tipografia Final */
                                    font-family: 'Times New Roman', Times, serif !important;
                                    font-size: 12pt !important;
                                    line-height: 1.5 !important;
                                    color: #000 !important;
                                }

                                                                /* Forçar estilos nos elementos internos para vencer o CSS do Tailwind/Quill */

                                                                .ql-editor p {

                                                                    margin-bottom: 10px !important;

                                                                    font-family: 'Times New Roman', Times, serif !important;

                                                                }

                                                                

                                                                /* Suporte para indentação via style inline */

                                                                .ql-editor p[style*="text-indent"] {

                                                                    text-indent: 50px !important;

                                                                }

                                

                                                                .ql-editor h1, .ql-editor h2, .ql-editor h3, .ql-editor h4 {

                                
                                    font-family: 'Times New Roman', Times, serif !important;
                                    font-weight: bold !important;
                                    text-align: center !important;
                                    margin-top: 20px !important;
                                    margin-bottom: 10px !important;
                                    line-height: 1.2 !important;
                                }
                                .ql-editor h1 { font-size: 16pt !important; text-transform: uppercase !important; }
                                .ql-editor h2 { font-size: 14pt !important; }
                                .ql-editor h3 { font-size: 12pt !important; text-align: center !important; }
                                
                                /* Garantir que nada seja sublinhado por padrão, a menos que seja um link (que não deve haver) */
                                .ql-editor * { text-decoration: none !important; }
                                
                                .ql-editor strong, .ql-editor b { font-weight: bold !important; }
                                .ql-editor em, .ql-editor i { font-style: italic !important; }
                                
                                .ql-editor ul, .ql-editor ol { margin-left: 20px !important; padding-left: 0 !important; }
                                .ql-editor li { margin-bottom: 5px !important; padding-left: 5px !important; }

                                /* Alinhamentos específicos do Quill */
                                .ql-editor .ql-align-center { text-align: center !important; }
                                .ql-editor .ql-align-right { text-align: right !important; }
                                .ql-editor .ql-align-justify { text-align: justify !important; }
                                
                                /* Remover borda azul de seleção do editor quando readOnly */
                                .ql-editor.ql-blank::before { color: rgba(0,0,0,0.6); font-style: normal; }

                                /* Ajustes para Impressão Real */
                                @media print {
                                    @page { 
                                        size: A4; 
                                        margin: 20mm; 
                                    }
                                    body { 
                                        background: white; 
                                        -webkit-print-color-adjust: exact;
                                    }
                                    body * { visibility: hidden; }
                                    .print-content, .print-content * { visibility: visible; }
                                    .print-content {
                                        position: absolute;
                                        left: 0;
                                        top: 0;
                                        width: 100%;
                                        margin: 0;
                                        padding: 0;
                                    }
                                    .ql-toolbar { display: none !important; }
                                    .ql-editor {
                                        width: 100% !important;
                                        min-height: auto !important;
                                        box-shadow: none !important;
                                        margin: 0 !important;
                                        padding: 0 !important; 
                                        background-image: none !important;
                                        overflow: visible !important;
                                    }
                                }
                            `}</style>

							<ReactQuill
								theme="snow"
								value={result}
								readOnly={true} // BLOQUEIA EDIÇÃO MANUAL
								modules={{ toolbar: false }} // DESATIVA TOOLBAR
							/>
						</div>
					</div>
				</div>

				{isRefining && (
					<div className="lg:col-span-4 space-y-6 order-1 lg:order-2 animate-in slide-in-from-right-4 duration-300">
						<div className="bg-white border border-blue-100 p-6 rounded-2xl shadow-xl sticky top-40">
							<div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
								<div className="bg-blue-100 p-2 rounded-lg text-blue-600">
									<PenTool size={24} />
								</div>
								<div>
									<h3 className="font-bold text-gray-900 leading-tight">Painel de Correção IA</h3>
									<p className="text-xs text-gray-500">O seu assistente pessoal de Recursos.</p>
								</div>
							</div>

							<div className="bg-blue-50 rounded-xl p-4 mb-6 text-sm text-blue-800 leading-relaxed">
								<p className="font-bold mb-2 flex items-center gap-2">
									<Info size={16} /> Como utilizar:
								</p>
								<ol className="list-decimal list-inside space-y-2">
									<li>Leia o documento ao lado.</li>
									<li>
										Identifique erros (ex: "A data está errada", "O modelo do carro é X", "Adicionar
										lei Y").
									</li>
									<li>
										Descreva o ajuste abaixo e clique em <strong>Aplicar Correções com IA</strong>.
									</li>
								</ol>
							</div>

							<div className="space-y-4">
								<label className="text-sm font-bold text-gray-700 block">
									O que precisa ser ajustado?
								</label>
								<textarea
									value={refinementText}
									onChange={(e) => setRefinementText(e.target.value)}
									rows={6}
									className="w-full p-4 rounded-xl border border-gray-300 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
									placeholder="Ex: Corrigir a data da infração para 12/05/2024. Remover parte que menciona a velocidade da via. Adicionar parágrafo alegando falta de visibilidade da placa."
								/>
								<div className="flex justify-between items-center text-xs text-gray-400 px-1">
									<span>Seja específico nas instruções.</span>
									<span>{refinementText.length} caracteres</span>
								</div>

								<button
									onClick={handleRefinementSubmit}
									disabled={!refinementText.trim() || refining || refinementCount <= 0}
									className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
										refinementCount <= 0
											? "bg-gray-100 text-gray-400 cursor-not-allowed"
											: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-0.5"
									}`}>
									{refining ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
									{refining ? "Processando Correções..." : "Aplicar Correções com IA"}
								</button>

								<div className="text-center">
									<span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full font-medium">
										{refinementCount} revisões restantes
									</span>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
