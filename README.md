# AI Resume Analyzer

A full-stack MERN application that analyzes resumes using AI (Google Gemini) and provides:
- ATS compatibility score (0-100)
- Missing skills detection
- ATS formatting issues
- Actionable improvement suggestions
- Optional job description matching

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js, Express
- **AI**: Google Gemini API (gemini-1.5-flash)
- **PDF Parsing**: pdf-parse
- **File Upload**: Multer

## Prerequisites

- Node.js v18+ installed
- A free Gemini API key from https://aistudio.google.com/app/apikey

## Setup Instructions

### 1. Get your Gemini API key
Go to https://aistudio.google.com/app/apikey, sign in with Google, and click "Create API key". Copy it.

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and paste your API key:
```
PORT=5000
GEMINI_API_KEY=your_actual_key_here
```

Run the backend:
```bash
npm start
```

You should see: `Server running on http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

This opens the app automatically at `http://localhost:3000`.

### 4. Test it

Upload any resume PDF and click "Analyze Resume". Within a few seconds you'll see the score and breakdown.

## Project Structure

```
ai-resume-analyzer/
├── backend/
│   ├── server.js              # Express server & routes
│   ├── utils/
│   │   ├── extractText.js     # PDF text extraction
│   │   └── analyzeResume.js   # Gemini AI analysis logic
│   ├── uploads/                # Temp storage for uploaded PDFs (auto-cleaned)
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js              # Main UI component
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   └── package.json
└── README.md
```

## Deployment (Free options)

- **Frontend**: Deploy to [Vercel](https://vercel.com) — connect your GitHub repo, it auto-detects React.
- **Backend**: Deploy to [Render](https://render.com) — create a new "Web Service", connect repo, set root directory to `backend`, add `GEMINI_API_KEY` as an environment variable.
- After deploying backend, update `REACT_APP_API_URL` in the frontend environment variables (Vercel dashboard) to point to your Render backend URL.

## Future Improvements

- User authentication + resume history (MongoDB)
- Multi-language resume support
- Export analysis as downloadable PDF report
- Resume version comparison (before/after score tracking)

## For CV / Scholarship Applications

Suggested one-line description:

> "Built a full-stack AI-powered resume analyzer using the MERN stack and Google Gemini API, providing ATS compatibility scoring, skill-gap analysis, and personalized improvement suggestions."
