import React, { useState, useRef } from "react";
import { PenTool, CheckCircle, Info } from "lucide-react";

export const QualificationEditorModal = ({ initialText, onSave, onClose }) => {
	const [text, setText] = useState(initialText);
	const backdropRef = useRef(null);
	const textareaRef = useRef(null);

	const handleScroll = (e) => {
		if (backdropRef.current) {
			backdropRef.current.scrollTop = e.target.scrollTop;
			backdropRef.current.scrollLeft = e.target.scrollLeft;
		}
	};

	const placeholders = [
		"NOME COMPLETO",
		"XXX.XXX.XXX-XX",
		"ENDEREÇO COMPLETO COM CEP",
		"(XX)XXXXX-XXXX",
		"EMAIL@PROVEDOR.com",
		"XXXYYYY",
		"XXXXXXXXXXX",
	];

	const handleTextareaClick = (e) => {
		const cursorPosition = e.target.selectionStart;
		
		for (const ph of placeholders) {
			let startIndex = 0;
			let index;
			while ((index = text.indexOf(ph, startIndex)) > -1) {
				const endIndex = index + ph.length;
				if (cursorPosition >= index && cursorPosition <= endIndex) {
					e.target.setSelectionRange(index, endIndex);
					return;
				}
				startIndex = endIndex;
			}
		}
	};

	const renderHighlightedText = () => {
		const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const combinedTokens = placeholders.map(escapeRegExp).join('|');
		const splitRegex = new RegExp(`(${combinedTokens})`, "g");

		const parts = text.split(splitRegex);

		return parts.map((part, i) => {
			if (!part) return null;
			if (placeholders.includes(part)) {
				return (
					<span key={i} className="bg-red-100 text-red-700 rounded-[2px] font-bold">
						{part}
					</span>
				);
			}
			// Todo o resto (texto estático ou inserido pelo usuário) fica na cor padrão
			return (
				<span key={i} className="text-gray-900">
					{part}
				</span>
			);
		});
	};

	return (
		<div className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center p-3 md:p-4 backdrop-blur-sm animate-in fade-in duration-300">
			<div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[95vh] overflow-hidden">
				<div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

				<div className="p-5 md:p-8 flex flex-col h-full overflow-y-auto">
					<div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
						<div>
							<h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
								<PenTool className="text-blue-600" /> Preencher Qualificação
							</h2>
							<p className="text-gray-600 text-sm mt-1">
								Substitua os dados destacados pelas suas informações reais. Clique nos destaques para facilitar o preenchimento.
							</p>
						</div>
					</div>

					<div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm mb-6 flex items-start gap-3 border border-blue-100">
						<Info className="shrink-0 mt-0.5 text-blue-600" size={20} />
						<p className="leading-relaxed text-justify">
							<strong>Ambiente Seguro:</strong> Você está editando um parágrafo de texto livre. Os
							dados abaixo serão inseridos diretamente no cabeçalho do seu PDF e não passarão por
							bancos de dados estruturados, garantindo sua total privacidade.
						</p>
					</div>

					<div className="flex-grow flex flex-col mb-6">
						<label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
							Editor de Qualificação (Texto Livre)
						</label>
						<div className="relative w-full flex-grow border border-gray-300 rounded-xl overflow-hidden bg-gray-50 min-h-[300px] font-mono text-[14px] md:text-[15px] leading-relaxed shadow-inner">
							<div
								ref={backdropRef}
								className="absolute inset-0 p-4 md:p-5 whitespace-pre-wrap break-words overflow-y-auto pointer-events-none z-0">
								{renderHighlightedText()}
							</div>
							<textarea
								ref={textareaRef}
								value={text}
								onChange={(e) => setText(e.target.value)}
								onScroll={handleScroll}
								onClick={handleTextareaClick}
								className="absolute inset-0 w-full h-full p-4 md:p-5 bg-transparent text-transparent caret-black resize-none outline-none z-10 overflow-y-auto"
								spellCheck="false"
							/>
						</div>
					</div>

					<div className="flex flex-col md:flex-row gap-3 mt-auto">
						<button
							onClick={onClose}
							className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all order-2 md:order-1">
							Cancelar
						</button>
						<button
							onClick={() => onSave(text)}
							className="flex-[2] px-6 py-3.5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 order-1 md:order-2">
							<CheckCircle size={20} /> Salvar Qualificação
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
