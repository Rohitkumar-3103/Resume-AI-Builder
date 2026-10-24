/**
 * Utility to export HTML element content directly to a Microsoft Word (.docx) compatible document.
 * @param {HTMLElement} element - The DOM element containing the resume or cover letter preview.
 * @param {string} filename - The target filename (e.g. "John_Doe_Resume.docx").
 */
export const downloadAsWord = (element, filename = "document.docx") => {
  if (!element) return;

  // Extract element HTML and inline styles
  const contentHtml = element.innerHTML;
  
  // Construct Word HTML document standard wrapper
  const header = `
    <html xmlns:o='urn:schemas-microsoft-microsoft-com:office:office'
          xmlns:w='urn:schemas-microsoft-microsoft-com:office:word'
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Exported Document</title>
      <style>
        @page {
          size: 8.5in 11.0in;
          margin: 0.75in 0.75in 0.75in 0.75in;
          mso-header-margin: 0.5in;
          mso-footer-margin: 0.5in;
          mso-paper-source: 0;
        }
        body {
          font-family: 'Calibri', 'Helvetica', 'Arial', sans-serif;
          font-size: 11pt;
          line-height: 1.4;
          color: #333333;
          background-color: #ffffff;
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Calibri', 'Arial', sans-serif;
          margin-top: 12pt;
          margin-bottom: 4pt;
        }
        h1 { font-size: 22pt; font-weight: bold; color: #111827; }
        h2 { font-size: 14pt; font-weight: 600; color: #374151; }
        h3 { font-size: 12pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px; }
        h4 { font-size: 11pt; font-weight: bold; color: #111827; }
        p { margin-top: 0; margin-bottom: 6pt; }
        a { color: #2563eb; text-decoration: none; }
        ul { margin-top: 4pt; margin-bottom: 6pt; padding-left: 20px; }
        li { margin-bottom: 3pt; }
        .contact-row { display: block; margin-top: 6pt; margin-bottom: 12pt; }
        .contact-item { display: inline-block; margin-right: 12pt; font-size: 10pt; color: #4b5563; }
        .preview-section { margin-bottom: 14pt; }
        .experience-item, .education-item, .project-item { margin-bottom: 10pt; }
        .exp-header, .edu-header, .proj-header { margin-bottom: 2pt; }
        .exp-role, .edu-degree, .proj-title { font-size: 11pt; font-weight: bold; margin: 0; }
        .exp-company, .edu-school { font-style: italic; color: #4b5563; }
        .exp-dates, .edu-dates { float: right; font-size: 10pt; color: #6b7280; }
        .skill-tag-item { display: inline-block; background-color: #f3f4f6; padding: 2px 8px; border-radius: 4px; margin-right: 4px; margin-bottom: 4px; font-size: 9.5pt; }
        .cover-letter-sheet { font-size: 11pt; line-height: 1.6; }
        .cl-header { margin-bottom: 20pt; border-bottom: 2px solid #2563eb; padding-bottom: 12pt; }
        .cl-body { margin-top: 16pt; margin-bottom: 20pt; text-align: justify; }
        .cl-paragraph { margin-bottom: 12pt; text-indent: 0; }
      </style>
    </head>
    <body>
      <div class="WordSection1">
        ${contentHtml}
      </div>
    </body>
    </html>
  `;

  // Create Blob with application/msword mime type
  const blob = new Blob(['\ufeff', header], {
    type: 'application/msword'
  });

  // Trigger file download
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = filename.endsWith('.docx') || filename.endsWith('.doc') ? filename : `${filename}.docx`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
};
