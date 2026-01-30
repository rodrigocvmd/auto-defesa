
export const formatDefenseToHtml = (text) => {
  if (!text) return "";

  // Estilos padrão para documentos jurídicos (ABNT/Forensic Style)
  const styles = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&display=swap');
      body {
        font-family: 'Times New Roman', serif;
        font-size: 12pt;
        line-height: 1.5;
        color: #000;
        margin: 40px; /* Margem para impressão */
        text-align: justify;
      }
      h1, h2, h3, h4, h5, h6 {
        text-align: center;
        font-weight: bold;
        text-transform: uppercase;
        margin-top: 24px;
        margin-bottom: 16px;
      }
      p {
        margin-bottom: 12px;
        text-indent: 0; /* Opcional: recuo de parágrafo se desejar */
      }
      .center {
        text-align: center;
      }
    </style>
  `;

  const wrapHtml = (content) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        ${styles}
      </head>
      <body>
        ${content}
      </body>
    </html>
  `;

  // Check if text is already HTML (basic check)
  const trimmedText = text.trim();
  if (trimmedText.startsWith("<") && (trimmedText.includes("</p>") || trimmedText.includes("</div>") || trimmedText.includes("</h3>"))) {
      // Se já for HTML, apenas envelopamos com os estilos globais para garantir a formatação no PDF
      return wrapHtml(text);
  }
  
  // Normalize line endings and process plain text
  const lines = text.split(/\r?\n/);
  
  let htmlBody = "";
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) {
      htmlBody += "<br/>";
      return;
    }

    // Heuristic for titles: Uppercase, short length (e.g., < 80 chars), and not a list item
    const isTitle = trimmed.length < 80 && trimmed === trimmed.toUpperCase() && !trimmed.startsWith("-") && /[A-Z]/.test(trimmed);
    
    // Heuristic for Signature lines (containing underscores)
    const isSignature = trimmed.includes("___");

    // Heuristic for Center alignment (dates, signatures)
    const isCenter = trimmed.toLowerCase().includes("nestes termos") || trimmed.toLowerCase().includes("pede deferimento") || isSignature;

    if (isTitle) {
      htmlBody += `<h3>${trimmed}</h3>`;
    } else if (isCenter) {
       htmlBody += `<p class="center">${trimmed}</p>`;
    } else {
      htmlBody += `<p>${trimmed}</p>`;
    }
  });

  return wrapHtml(htmlBody);
};

