// Import Express.js
const express = require('express');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

// Route for GET requests
app.get('/', (req, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

// Route for POST requests
app.post('/', (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp} in added using app dashboard url\n`);
  console.log(JSON.stringify(req.body, null, 2));
  try {
    const response = fetch("https://18568f9ff93a.ngrok-free.app/worker/api/webhook/whatsapp-1.0.0/webhook-listener", {"method": "POST"});
    try {
      console.log(await response.json());
    } catch (err) {
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText || "{}");
        const errorMessage =
          errorJson?.error ||
          errorJson?.errors ||
          errorJson?.description ||
          errorJson?.message ||
          errorText;
        console.log( error: errorMessage, status: response?.status || 500 );
      } catch (error: any) {
        console.log(
          error:
            errorText || error?.message || error?.description || String(error),
          status: response?.status || 500,
        );
      }
  } catch(error) {
    console.log(error?.message || error?.response || error?.error);
  }
  res.status(200).end();
});

// Route for GET requests
app.get('/alt', (req, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

// Route for POST requests
app.post('/alt', (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp} in alternate url\n`);
  console.log(JSON.stringify(req.body, null, 2));
  res.status(200).end();
});

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});
