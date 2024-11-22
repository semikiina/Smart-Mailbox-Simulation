const mqtt = require('mqtt');

// Connect to the MQTT broker
const client = mqtt.connect('mqtt://localhost');

// Maximum capacity of the mailbox (in grams)
const MAILBOX_CAPACITY = 1000; // Example: 1kg

// Current total weight in the mailbox
let currentWeight = 0;

// Initialize the MailController
const initializeMailController = () => {
  console.log('Mail Controller initialized and listening to MQTT messages');

  // Subscribe to the 'mailbox/weight' topic
  client.subscribe('mailbox/weight', (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to mailbox/weight topic');
    }
  });

  // Process received messages
  client.on('message', (topic, message) => {
    if (topic === 'mailbox/weight') {
      // Parse the incoming message
      const payload = JSON.parse(message.toString());
      const { weight, timestamp } = payload;

      // Update the current weight in the mailbox
      currentWeight += weight;

      // Calculate the total number of letters based on 20g per letter
      const mailCount = Math.floor(currentWeight / 20);

      // Log details about the received mail
      console.log(`Received new mail at ${timestamp}:`);
      console.log(`  - Weight of current mail: ${weight} grams`);
      console.log(`  - Total number of letters: ${mailCount}`);
      console.log(`  - Total weight in mailbox: ${currentWeight} grams`);

      // Check if the mailbox is full
      if (currentWeight >= MAILBOX_CAPACITY) {
        console.log('Mailbox is full!');
      } else {
        console.log('Mailbox is not full yet.');
      }
    }
  });
};

// Error handling for the MQTT client
client.on('error', (err) => {
  console.error('MQTT client error:', err);
});

// Start the MailController
initializeMailController();

// Export the MailController initialization function for reuse
module.exports = { initializeMailController };
