# Assignment Submission Portal

## Run the Application
```
npm install
node server.js
# Visit http://localhost:3000
```

## Run Tests Locally
```
npm test
```

## Start the Local Report Receiver
```
node receiver.js
# Listens on http://localhost:4000
```

## Tunnel Setup (for GitHub Actions → localhost)
```
ngrok http 4000
# Copy the https://xxxx.ngrok-free.app URL
# Add it as a GitHub secret: RECEIVER_URL
```