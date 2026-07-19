const pdfParse = require('pdf-parse');
const fs = require('fs');

/**
 * Extracts raw text from a PDF file.
 * @param {string} filePath - Path to the uploaded PDF file
 * @returns {Promise<string>} Extracted text content
 */
async function extractText(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

module.exports = extractText;
