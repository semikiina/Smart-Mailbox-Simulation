const mqtt = require('mqtt');

(async () => {
  let client;
  let publishInterval;

  // Connect to the MQTT server
  console.log('Connecting...');
  client = await mqtt.connectAsync('mqtt://localhost:1883');
  console.log('Connected');

  // Set up the message receiving handler
  client.on(
    'message',
    (topic, message) => console.log(`Message received on topic "${topic}": ${message.toString()}`)
  );

  // Subscribe to the topic "mailbox/incoming"
  await client.subscribeAsync('mailbox/incoming');
  console.log('Subscribed to "mailbox/incoming" topic');

  // Subscribe to the topic "mailbox/weight"
  await client.subscribeAsync('mailbox/weight');
  console.log('Subscribed to "mailbox/weight" topic');

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

  startPublishingRandomWeights();

  // Stop the publishing loop after timeout 
  setTimeout(() => {
    stopPublishingRandomWeights();
  }, 11000); 

})().catch(error => {
  console.error('An error occurred!');
  console.error(error);
  process.exit(1);
});
