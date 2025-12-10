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
app.post('/', async (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp} (received on root)\n`);
  console.log(JSON.stringify(req.body, null, 2));

  // Example forwarding URL — update as needed
  const forwardUrl =
    process.env.FORWARD_URL ||
    'https://18568f9ff93a.ngrok-free.app/worker/api/webhook/whatsapp-1.0.0/webhook-listener';

  try {
    const response = await fetch(forwardUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    // try parse JSON, otherwise fallback to text
    let forwardedResponse;
    try {
      forwardedResponse = await response.json();
    } catch (e) {
      forwardedResponse = await response.text();
    }

    console.log('Forwarded response status:', response.status);
    console.log('Forwarded response body:', forwardedResponse);

    return res.sendStatus(200);
  } catch (err) {
    console.error('Error forwarding webhook:', err?.message ?? err);
    // Still respond 200 to acknowledge receipt to original sender (change if you want different behavior)
    return res.sendStatus(200);
  }
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
