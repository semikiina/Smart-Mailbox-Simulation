const mqtt = require('mqtt');
const http = require('http');
let isMailboxFull = false;
const Mailbox = require('../models/Mailbox');

// Connect to the MQTT broker
const client = mqtt.connect('mqtt://localhost');

// Schutzvariable: Initialisierung verhindern
let isInitialized = false;

// Maximum capacity of the mailbox (in grams)
const MAILBOX_CAPACITY = 2000; // Example: 2kg

// Current total weight in the mailbox
let currentWeight = 0;

// List of received mails (with weight and timestamp)
const receivedMails = [];

// Function to format a date
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString({
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// Initialize the MailController
const initializeMailController = () => {
  if (isInitialized) {
    console.log('Mail Controller already initialized. Skipping...');
    return; // Verhindere doppelte Initialisierung
  }
  isInitialized = true;

  console.log('Mail Controller initialized and listening to MQTT messages');

  // Remove any previously registered handlers to prevent duplicates
  client.removeAllListeners('message');

  // Subscribe to the 'mailbox/weight' topic
  client.subscribe('mailbox/weight', (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to mailbox/weight topic');
    }
  });

  client.on('message', async (topic, message) => {
    if (topic === 'mailbox/weight') {
      // Parse the incoming message
      const payload = JSON.parse(message.toString());
      const { weight, timestamp } = payload;

      // Check if the mailbox is full before processing the new mail
      if (isMailboxFull) {
        console.log('Mailbox is full, ignoring new mail data.');
        return; // Ignore the new mail data if the mailbox is full
      }

      // Add the new mail to the receivedMails array
      receivedMails.push({
        weight,
        timestamp: formatDate(timestamp),
      });

      // Update the current weight in the mailbox
      currentWeight += weight;

      // Calculate the total number of letters based on 20g per letter
      const mailCount = Math.floor(currentWeight / 20);

      console.log(`Received new mail at ${timestamp}:`);
      console.log(`  - Weight of current mail: ${weight} grams`);
      console.log(`  - Total number of letters: ${mailCount}`);
      console.log(`  - Total weight in mailbox: ${currentWeight} grams`);

      // Save to the database
      const mailEntry = new Mailbox({
        weight,
        timestamp: new Date(timestamp),
        totalWeight: currentWeight,
        mailCount,
      });

      await mailEntry.save();
      console.log('Mail entry saved to database.');

      // Check if the mailbox is full
      if (currentWeight >= MAILBOX_CAPACITY) {
        console.log('Mailbox is now full!');
        isMailboxFull = true; // Set the full flag

        // Publish a notification to "mailbox/full" topic
        client.publish('mailbox/full', JSON.stringify({
          message: 'Mailbox is full, please empty it',
          currentWeight,
          timestamp: new Date().toISOString(),
        }), { qos: 1 });
      }
    }

    console.log("-----------------------------");
    console.log("");
  });
};

const emptyMailbox = () => {
  // Reset all mailbox data
  currentWeight = 0;
  receivedMails.length = 0; // Delete the list of received mails
  isMailboxFull = false; // Mark the mailbox as not full

  // Return the reset mailbox data
  return {
    currentWeight,
    mailCount: Math.floor(currentWeight / 20),
    isFull: false,
    receivedMails,
  };
};

// Error handling for the MQTT client
client.on('error', (err) => {
  console.error('MQTT client error:', err);
});

// HTTP Server to provide mailbox data
const server = http.createServer((req, res) => {
  // Add CORS headers to allow cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allowed methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allowed headers

  // Handle preflight (OPTIONS) requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204); // No Content
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/mailbox') {
    const mailCount = Math.floor(currentWeight / 20);
    const isFull = currentWeight >= MAILBOX_CAPACITY;

    // Return the current state of the mailbox as JSON
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        currentWeight,
        mailCount,
        isFull,
        receivedMails,
      })
    );
  }
  // Route for emptying the mailbox
  else if (req.method === 'POST' && req.url === '/empty-mailbox') {
    // Leere die Mailbox
    const updatedMailboxData = emptyMailbox();

    // Return the status of the empty mailbox in response
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(updatedMailboxData));
  }
  // Handle invalid routes
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Start the HTTP server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`HTTP server is running on http://localhost:${PORT}`);
});

// Start the MailController
initializeMailController();

// Export the MailController initialization function for reuse
module.exports = { initializeMailController };
