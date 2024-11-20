const mqtt = require('mqtt');

async function initializeMqtt() {
  try {
    // Connect to the MQTT server with authentication
    console.log('Connecting to MQTT broker...');
    const client = await mqtt.connectAsync('mqtt://localhost:1883');
    console.log('Connected to MQTT broker');

    // Set up message receiving handler
    client.on('message', (topic, message) => {
      console.log(`Message received on topic "${topic}": ${message.toString()}`);
    });

    // Subscribe to topics
    await client.subscribeAsync('mailbox/incoming');
    console.log('Subscribed to "mailbox/incoming" topic');

    await client.subscribeAsync('mailbox/weight');
    console.log('Subscribed to "mailbox/weight" topic');

    // Function to generate random weight between 0 and 99
    const getRandomWeight = () => Math.floor(Math.random() * 100);

    // Generate random time intervals between 5 and 10 seconds
    const getRandomInterval = () => {
      const min = 5 * 1000; // 5 seconds
      const max = 10 * 1000; // 10 seconds
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Function to publish random weights
    const startPublishingRandomWeights = () => {
      publishInterval = setInterval(() => {
        const randomWeight = getRandomWeight(); // Generates a random weight between 0 and 99
        client.publish('mailbox/weight', randomWeight.toString(), { qos: 2 });
        console.log(`Published random weight: ${randomWeight} to "mailbox/weight" topic`);
      }, getRandomInterval()); // Use random interval between 5 and 10 seconds
    };

    const stopPublishingRandomWeights = () => {
      clearInterval(publishInterval);
      console.log('Stopped publishing random weights.');
    };

    // Start publishing
    startPublishingRandomWeights();

    // Stop the publishing loop after timeout
    setTimeout(() => {
      stopPublishingRandomWeights();
    }, 120000); // Stops after 120 seconds to stop for testing, adjust as needed

    // Handle cleanup on client error
    client.on('error', (error) => {
      console.error('MQTT client error:', error);
      client.end();
    });

  } catch (error) {
    console.error('Failed to connect to MQTT broker:', error);
    process.exit(1);
  }
}

module.exports = { initializeMqtt };
