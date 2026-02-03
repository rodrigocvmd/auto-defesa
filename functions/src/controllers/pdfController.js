const cors = require("../middleware/cors");
const { verifyAuth } = require("../middleware/auth");
const { checkAndDeductCredits } = require("../services/userService"); // Opcional: cobrar crédito por geração? Por enquanto não.
// Removido require global do puppeteer para evitar crash no startup se faltarem dependências
// const puppeteer = require("puppeteer");

exports.generatePdf = (req, res) => {
	cors(req, res, async () => {
		let userId;
		try {
			userId = await verifyAuth(req);
		} catch (e) {
			res.status(401).json({ error: "Usuário não autenticado." });
			return;
		}

		const { htmlContent, fileName } = req.body;

		if (!htmlContent) {
			res.status(400).json({ error: "Conteúdo HTML obrigatório." });
			return;
		}

		try {
            // Lazy load do Puppeteer apenas quando a função for chamada
            const puppeteer = require("puppeteer");

			console.log(`[PDF] Iniciando geração para usuário ${userId || "anônimo"}...`);
			
			// Lançar navegador headless
			const browser = await puppeteer.launch({
				headless: "new", // Modo headless mais recente e estável
				args: [
                    "--no-sandbox", 
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage", // Evita crash por falta de memória compartilhada
                    "--disable-gpu", // Necessário em muitos ambientes headless
                    "--font-render-hinting=none" // Melhora renderização de fontes
                ],
			});

			const page = await browser.newPage();

			// Definir HTML completo com estilos de impressão
			const finalHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        @page {
                            size: A4 portrait;
                            margin: 20mm;
                        }
                        body {
                            font-family: 'Times New Roman', Times, serif;
                            font-size: 12pt;
                            line-height: 1.5;
                            color: #000;
                            text-align: justify;
                            margin: 0;
                            padding: 0;
                        }
                        h1, h2, h3, h4 {
                            text-align: center;
                            font-weight: bold;
                            margin-top: 20px;
                            margin-bottom: 10px;
                        }
                        p {
                            margin-bottom: 10px;
                        }
                        img {
                            max-width: 100%;
                            height: auto;
                        }
                        /* Classes do Quill Editor */
                        .ql-align-center { text-align: center; }
                        .ql-align-right { text-align: right; }
                        .ql-align-justify { text-align: justify; }
                        
                        /* Forçar quebras de página limpas */
                        .page-break { page-break-before: always; }
                    </style>
                </head>
                <body>
                    ${htmlContent}
                </body>
                </html>
            `;

			console.log("[PDF] Definindo conteúdo da página...");
			await page.setContent(finalHtml, { 
				waitUntil: "networkidle0",
				timeout: 60000 // 60s timeout para imagens pesadas
			});

			console.log("[PDF] Gerando buffer...");
			const pdfBuffer = await page.pdf({
				format: "A4",
				printBackground: true,
				margin: {
					top: "20mm",
					right: "20mm",
					bottom: "20mm",
					left: "20mm",
				},
			});

			await browser.close();
			
			console.log(`[PDF] Sucesso! Tamanho do Buffer: ${pdfBuffer.length} bytes`);

			// Configurar headers para download
			res.set({
				"Content-Type": "application/pdf",
				"Content-Disposition": `attachment; filename="${fileName || "recurso.pdf"}"`,
				"Content-Length": pdfBuffer.length,
			});

			// Enviar como binário puro para evitar corrupção por middlewares de texto
			res.end(pdfBuffer, "binary");
		} catch (error) {
			console.error("Erro ao gerar PDF:", error);
			res.status(500).json({ error: "Erro interno ao gerar documento PDF: " + error.message });
		}
	});
};
