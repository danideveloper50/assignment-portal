const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4000;
const REPORT_FILE = path.join(__dirname, 'testreport.json');

const server = http.createServer((req, res) => {

  // CORS headers (needed for some tunnel configurations)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  if (req.method === 'POST' && req.url === '/report') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const report = JSON.parse(body);

        // Save to testreport.json
        fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));

        console.log('═══════════════════════════════════════');
        console.log('📋 Test Report Received!');
        console.log(`   Repository : ${report.repository}`);
        console.log(`   Branch     : ${report.branch}`);
        console.log(`   Commit     : ${report.commitSHA?.substring(0, 7)}`);
        console.log(`   Run ID     : ${report.pipelineRunId}`);
        console.log(`   Status     : ${report.summary?.status?.toUpperCase()}`);
        console.log(`   Tests      : ${report.summary?.passed}/${report.summary?.total} passed`);
        console.log(`   Saved to   : ${REPORT_FILE}`);
        console.log('═══════════════════════════════════════');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Report saved.' }));
      } catch (err) {
        console.error('❌ Failed to parse report:', err.message);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON.' }));
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`📡 Report Receiver listening on http://localhost:${PORT}`);
  console.log('   Waiting for test reports from CI pipeline...');
});