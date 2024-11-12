const mqtt = require('mqtt');

async function initializeMqtt() {
  try {
    // Connect to the MQTT server with authentication
    console.log('Connecting to MQTT broker...');
    const client = await mqtt.connectAsync('mqtt://localhost:1883', {
    });
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

    // Function to publish random weights
    const startPublishingRandomWeights = () => {
        publishInterval = setInterval(() => {
          const randomWeight = Math.floor(Math.random() * 100); // Generates a random integer between 0 and 99
          client.publish('mailbox/weight', randomWeight.toString(), { qos: 2 });
          console.log(`Published random weight: ${randomWeight} to "mailbox/weight" topic`);
        }, 5000);
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
    }, 11000); 
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
