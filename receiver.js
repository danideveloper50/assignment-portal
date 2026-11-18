// Local HTTP report receiver: accepts POSTed CI/test reports and stores them.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.RECEIVER_PORT || 4000;
const REPORT_FILE = path.join(__dirname, 'reports.log');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/report') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      const entry = `[${new Date().toISOString()}] ${body}\n`;
      fs.appendFileSync(REPORT_FILE, entry);
      console.log('Report received:', body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ received: true }));
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Report receiver listening on http://localhost:${PORT}/report`);
});
