const mqtt = require('mqtt');

// Connect to the MQTT broker running locally
const client = mqtt.connect('mqtt://localhost');

const LETTER_WEIGHT = 20;

const getRandomLetterCount = (min = 1, max = 10) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomInterval = (min = 5000, max = 10000) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

//publishing
const publishWeight = () => {

  const letterCount = getRandomLetterCount();

  const weight = letterCount * LETTER_WEIGHT;

  const timestamp = new Date().toISOString();

  const payload = JSON.stringify({ weight, timestamp });

  // Publish the payload to the MQTT topic 'mailbox/weight'
  client.publish('mailbox/weight', payload, () => {
    console.log(`Published: ${payload}`);
  });
};

// When connected to the MQTT broker, start publishing messages at random intervals
client.on('connect', () => {
  console.log('Connected to MQTT broker');

  setInterval(() => {
    publishWeight();
  }, getRandomInterval());
});

client.on('error', (err) => {
  console.error('Error:', err);
});

module.exports = { getRandomLetterCount, getRandomInterval };
