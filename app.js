const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const connectDatabase = require('./config/dbconfig'); // Database connection
const { initializeMqtt } = require('./mqtt/mqttConnection'); // Import MQTT initialization
const { initializeMailController } = require('./controllers/mailController'); // Import Mail Controller

const app = express();

// Define mailbox data object
let mailboxData = {
  currentWeight: 0,
  mailCount: 0,
  isFull: false,
  receivedMails: [],
};

// Middleware and settings
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse URL-encoded data and serve static files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to get mailbox data
app.get('/mailbox', (req, res) => {
  res.json(mailboxData); // Send mailbox data as JSON response
});

// Initialize MQTT connection and Mail Controller
initializeMqtt(); // Initialize MQTT connection
initializeMailController(mailboxData); // Start Mail Controller and pass mailboxData

// Start the server on port 1080
app.listen(1080, () => {
  // Connect to the database and handle errors
  connectDatabase().catch(console.error);
  console.log('Server is running on http://localhost:1080'); // Log server status
});