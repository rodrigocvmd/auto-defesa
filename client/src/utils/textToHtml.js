
export const formatDefenseToHtml = (text) => {
  if (!text) return "";

  // Check if text is already HTML (basic check)
  // If the AI returns HTML with inline styles, we return it directly to preserve formatting.
  const trimmedText = text.trim();
  if (trimmedText.startsWith("<") && (trimmedText.includes("</p>") || trimmedText.includes("</div>") || trimmedText.includes("</h3>"))) {
      return text;
  }
  
  // Normalize line endings
  const lines = text.split(/\r?\n/);
  
  let html = "";
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) {
      html += "<br/>";
      return;
    }

    // Heuristic for titles: Uppercase, short length (e.g., < 60 chars), and not a list item
    const isTitle = trimmed.length < 60 && trimmed === trimmed.toUpperCase() && !trimmed.startsWith("-");
    
    if (isTitle) {
      // Add extra spacing before titles
      html += `<h3 style="text-align: center; font-weight: bold; margin-top: 20px; margin-bottom: 10px; font-family: 'Times New Roman', serif;">${trimmed}</h3>`;
    } else {
      // Regular paragraph
      html += `<p style="text-align: justify; margin-bottom: 10px; font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5;">${trimmed}</p>`;
    }
  });

  return html;
};

