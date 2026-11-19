const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));

// In-memory store for submissions
let submissions = [];

// Helper: validate URL format
function isValidURL(str) {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// GET  / — serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// POST /submit — handle form submission
app.post('/submit', (req, res) => {
  const { name, regNumber, title, url } = req.body;

  // Validate required fields
  if (!name || !regNumber || !title || !url) {
    return res.status(400).json({
      error: 'All fields are required.'
    });
  }

  // Validate URL
  if (!isValidURL(url)) {
    return res.status(400).json({
      error: 'Invalid submission URL.'
    });
  }

  const submission = { name, regNumber, title, url, date: new Date().toISOString() };
  submissions.push(submission);

  return res.status(201).json({ message: 'Submission saved.', submission });
});

// GET /submissions — return all submissions
app.get('/submissions', (req, res) => {
  res.json(submissions);
});

// DELETE /submissions — reset (used by tests)
app.delete('/submissions', (req, res) => {
  submissions.length = 0;
  res.status(204).end();
});

module.exports = app;