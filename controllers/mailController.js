const mqtt = require('mqtt');
const debug = require('debug')('mqtt-mailbox');

// Constants for mail weight and max mailbox weight
const MAIL_WEIGHT = 15; // Weight of a single mail item in grams
const MAX_WEIGHT = 800; // Maximum weight threshold for mailbox to be considered "full"

// Variables for current weight, mail count, and mailbox full status
let currentWeight = 0;
let mailCount = 0;
let isMailboxFull = false;

// MQTT Broker configuration
const brokerUrl = 'mqtt://localhost'; // Example URL, adjust for your broker
const topic = 'mailbox/incoming'; // Topic for incoming mail notifications

// MQTT client initialization
const client = mqtt.connect(brokerUrl);

// Function to handle incoming MQTT messages
function handleMqttMessage(topic, message) {
  debug(`Received message on topic "${topic}": ${message.toString()}`);
  
  if (topic === 'mailbox/incoming') {
    try {
      const notification = JSON.parse(message.toString());
      const weight = notification.weight;

      if (!isNaN(weight)) {
        updateCurrentWeight(weight);
      } else {
        console.error('Invalid weight value:', notification);
      }
    } catch (error) {
      console.error('Error parsing notification:', error);
    }
  }
}

// Function to update the current weight
function updateCurrentWeight(weight) {
  currentWeight += weight;
  updateMailCount();
  checkMailboxFull();
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
  debug('Sending data to frontend:', data);
}

// Main function to initialize the controller
function initializeMailController() {
  debug('Initializing Mail Controller...');
  
  // Initialize the MQTT connection
  client.on('connect', () => {
    debug('Connected to MQTT broker');
    client.subscribe(topic, (err) => {
      if (err) {
        console.error('Error subscribing to topic:', err);
      } else {
        debug(`Subscribed to "${topic}"`);
      }
    });
  });

  // Set up the message handler
  client.on('message', handleMqttMessage);

  debug('Mail Controller initialized.');
}

module.exports = { initializeMailController };
