# Assignment Portal

Simple Express app for submitting assignments, with Jest tests and a GitHub Actions CI pipeline.

## Structure

- `app.js` – Express app (exported for tests)
- `server.js` – starts the server (entry point)
- `views/index.html` – frontend form + submission list
- `tests/submission.test.js` – Jest/Supertest tests
- `receiver.js` – local HTTP report receiver
- `.github/workflows/ci.yml` – GitHub Actions pipeline

## Usage

```bash
npm install
npm start        # http://localhost:3000
npm test         # run tests
npm run receiver # report receiver on :4000
```
