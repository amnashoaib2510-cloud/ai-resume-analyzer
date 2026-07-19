const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Sends resume text to Gemini and returns a structured analysis.
 * @param {string} resumeText - Raw text extracted from the resume PDF
 * @param {string} jobDescription - Optional job/scholarship description to match against
 * @returns {Promise<Object>} Structured analysis object
 */
async function analyzeResume(resumeText, jobDescription = '') {
 const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
  const jdSection = jobDescription
    ? `\n\nCompare the resume against this target job/scholarship description:\n${jobDescription}`
    : '';

  const prompt = `You are an expert ATS (Applicant Tracking System) resume analyzer.
Analyze the resume text below and return ONLY valid JSON (no markdown formatting, no backticks, no extra commentary) with EXACTLY this structure:

{
  "score": <number between 0 and 100>,
  "strengths": [<3 to 5 short strings>],
  "missingSkills": [<3 to 5 short strings>],
  "atsIssues": [<3 to 5 short strings describing formatting/ATS problems>],
  "suggestions": [<3 to 5 short, actionable improvement strings>]
}

Scoring guide:
- 90-100: Excellent, ATS-friendly, strong keywords, clear structure
- 70-89: Good, minor improvements needed
- 50-69: Average, several gaps
- Below 50: Needs significant rework

Resume text:
${resumeText}${jdSection}`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  // Gemini sometimes wraps JSON in markdown code fences - strip them
  const cleaned = responseText.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error('Failed to parse AI response as JSON: ' + err.message);
  }
}

module.exports = analyzeResume;
