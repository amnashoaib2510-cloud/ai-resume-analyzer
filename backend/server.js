const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const extractText = require('./utils/extractText');
const analyzeResume = require('./utils/analyzeResume');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer config - only accept PDFs, max 5MB
const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/upload', upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;
  const jobDescription = req.body.jobDescription || '';

  try {
    const text = await extractText(filePath);

    if (!text || text.trim().length < 50) {
      return res.status(400).json({ error: 'Could not extract enough text from this PDF. Try a different file.' });
    }

    const analysis = await analyzeResume(text, jobDescription);
    res.json(analysis);
  } catch (err) {
    console.error('Analysis error:', err.message);
    res.status(500).json({ error: 'Failed to analyze resume. Please try again.' });
  } finally {
    // Clean up uploaded file after processing
    fs.unlink(filePath, () => {});
  }
});

// Handle multer errors (file too large, wrong type, etc.)
app.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
