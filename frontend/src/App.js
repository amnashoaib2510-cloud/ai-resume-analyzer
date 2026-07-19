import { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function ScoreCircle({ score }) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444';
  return (
    <div className="score-circle" style={{ borderColor: color }}>
      <span style={{ color }}>{score}</span>
      <small>/ 100</small>
    </div>
  );
}

function ResultSection({ title, items, icon }) {
  return (
    <div className="result-section">
      <h3>{icon} {title}</h3>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type !== 'application/pdf') {
      setError('Please upload a PDF file only.');
      setFile(null);
      return;
    }
    setError('');
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a resume PDF first.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      const res = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📄 AI Resume Analyzer</h1>
        <p>Upload your CV and get an instant ATS score, missing skills, and improvement suggestions.</p>
      </header>

      <div className="card">
        <label className="upload-box">
          <input type="file" accept=".pdf" onChange={handleFileChange} hidden />
          {file ? `✅ ${file.name}` : '📎 Click to upload your resume (PDF only)'}
        </label>

        <textarea
          className="jd-input"
          placeholder="Optional: paste a target job description or scholarship requirement to compare against..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={3}
        />

        {error && <p className="error">{error}</p>}

        <button className="analyze-btn" onClick={handleUpload} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </div>

      {result && (
        <div className="card result-card">
          <div className="score-row">
            <ScoreCircle score={result.score} />
            <div>
              <h2>Resume Score</h2>
              <p>Here's how your resume performs against ATS and industry standards.</p>
            </div>
          </div>

          <ResultSection title="Strengths" items={result.strengths} icon="✅" />
          <ResultSection title="Missing Skills" items={result.missingSkills} icon="⚠️" />
          <ResultSection title="ATS Issues" items={result.atsIssues} icon="🚫" />
          <ResultSection title="Suggestions" items={result.suggestions} icon="💡" />
        </div>
      )}
    </div>
  );
}

export default App;
