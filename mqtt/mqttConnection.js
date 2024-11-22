const mqtt = require('mqtt');
const { getRandomWeight, getRandomInterval } = require('../scripts/mailNotifier');

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

    // Function to publish random weights with the current date and time
    const startPublishingRandomData = () => {
      const publishRandomData = () => {
        const randomWeight = getRandomWeight(70, 350); // Generate weight between 70 and 350
        const currentDateTime = new Date().toISOString(); // Get the current date and time
        const data = {
          weight: randomWeight,
          date: currentDateTime,
        };

        client.publish('mailbox/weight', JSON.stringify(data), { qos: 2 }, (err) => {
          if (err) {
            console.error('Error publishing message:', err);
          } else {
            console.log(`Published data: ${JSON.stringify(data)}`);
          }
        });

        const nextInterval = getRandomInterval(5000, 10000); // Random interval between 5-10 seconds
        console.log(`Next publish in ${nextInterval / 1000} seconds`);
        setTimeout(publishRandomData, nextInterval); // Schedule next publish
      };

      publishRandomData(); // Start the first publish
    };

    // Start publishing
    startPublishingRandomData();

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

