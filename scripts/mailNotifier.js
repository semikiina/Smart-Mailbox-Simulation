const mqtt = require('mqtt');

// Connect to the MQTT broker running locally
const client = mqtt.connect('mqtt://localhost'); 

// Define the weight of a single letter in grams
const LETTER_WEIGHT = 20;

// Function to generate a random number of letters
// `min` is the minimum number of letters, `max` is the maximum
const getRandomLetterCount = (min = 1, max = 10) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to generate random intervals (in milliseconds) for message publishing
// `min` is the minimum interval, `max` is the maximum
const getRandomInterval = (min = 5000, max = 10000) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to publish the total weight and timestamp to the MQTT topic
const publishWeight = () => {
  // Generate a random number of letters
  const letterCount = getRandomLetterCount();

  // Calculate the total weight based on the number of letters
  const weight = letterCount * LETTER_WEIGHT; 

  // Get the current timestamp in ISO format
  const timestamp = new Date().toISOString();

  // Prepare the payload as a JSON object
  const payload = JSON.stringify({ weight, timestamp });

  // Publish the payload to the MQTT topic 'mailbox/weight'
  client.publish('mailbox/weight', payload, () => {
    console.log(`Published: ${payload}`);
  });
};

// When connected to the MQTT broker, start publishing messages at random intervals
client.on('connect', () => {
  console.log('Connected to MQTT broker');

  // Set an interval to publish a message every 5 to 10 seconds
  setInterval(() => {
    publishWeight();
  }, getRandomInterval());
});

// Handle errors in the MQTT client
client.on('error', (err) => {
  console.error('Error:', err);
});

// Export functions for testing or external usage
module.exports = { getRandomLetterCount, getRandomInterval };
