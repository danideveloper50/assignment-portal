const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

// In-memory store
let submissions = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/submissions', (req, res) => {
  res.json(submissions);
});

app.post('/api/submissions', (req, res) => {
  const { studentName, rollNo, title } = req.body || {};
  if (!studentName || !rollNo || !title) {
    return res.status(400).json({ error: 'studentName, rollNo and title are required' });
  }
  const submission = {
    id: submissions.length + 1,
    studentName,
    rollNo,
    title,
    submittedAt: new Date().toISOString(),
  };
  submissions.push(submission);
  res.status(201).json(submission);
});

// Helper for tests
app.resetSubmissions = () => {
  submissions = [];
};

module.exports = app;
