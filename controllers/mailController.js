/*
const Mail = require('../models/Mail');

exports.getAllMail = async (req, res) => {

    const userId = req.user.id; // Get the user ID from the request object

  try {
    const mails = await Mail.findAll();
    res.render('mails', { mails });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
*/

// Import MQTT library
const mqtt = require('mqtt');

// MQTT Broker configuration
const brokerUrl = 'mqtt://localhost'; // Example URL, adjust for your broker
const topic = 'mailbox/weight'; // Topic for weight data from the scale

// Constants for mail weight and max mailbox weight
const MAIL_WEIGHT = 15; // Weight of a single mail item in grams
const MAX_WEIGHT = 800; // Maximum weight threshold for mailbox to be considered "full"

// Variables for current weight, mail count, and mailbox full status
let currentWeight = 0;
let mailCount = 0;
let isMailboxFull = false;

// Initialize and connect MQTT client
const client = mqtt.connect(brokerUrl);

// Event handler when client connects successfully
client.on('connect', () => {
    console.log('Connected to MQTT Broker');
    client.subscribe(topic, (err) => {
        if (err) {
            console.error('Error subscribing to topic:', err);
        }
    });
});

// Event handler for incoming messages from MQTT Broker
client.on('message', (topic, message) => {
    // Parse message content to a weight value
    const weight = parseFloat(message.toString());
    if (!isNaN(weight)) {
        updateCurrentWeight(weight);
    } else {
        console.error('Invalid weight value:', message.toString());
    }
});

// Function to update the current weight
function updateCurrentWeight(weight) {
    currentWeight = weight;
    updateMailCount();
    checkMailboxFull();

    // Send data to frontend
    sendDataToFrontend();
}

// Function to calculate the number of mail items
function updateMailCount() {
    mailCount = Math.floor(currentWeight / MAIL_WEIGHT);
}

// Function to check if the mailbox is full
function checkMailboxFull() {
    isMailboxFull = currentWeight >= MAX_WEIGHT;
}

// Function to send data to the frontend
function sendDataToFrontend() {
    const data = {
        currentWeight: currentWeight,
        mailCount: mailCount,
        isMailboxFull: isMailboxFull,
    };

    // Example: handler call (adjust to your frontend communication method)
    frontendHandler(data);
}

// Example handler function for frontend communication
function frontendHandler(data) {
    // Here you can implement a specific method to communicate with the frontend,
    // such as WebSocket, HTTP, or another method.
    console.log('Data sent to frontend:', data);
}

