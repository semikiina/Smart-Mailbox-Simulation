// const express = require('express');
// const router = express.Router();
// const mailController = require('../controllers/mailController');

// router.get('/', (req, res) => {
//   res.render('index');
// });

// router.get('/users', mailController.getAllMail);

// module.exports = router;

// const mqtt = require('mqtt');
// const host = 'test.mosquitto.org';
// const port = '1883';
// const clientId = '123';

// const connectUrl = `mqtt://${host}:${port}`;

// const client = mqtt.connect(connectUrl, {
//   clientId,
//   username: 'admin',
//   password: '12345'
// });

// const topic = '/nodejs/mqtt'

// client.on('connect', () => {
//   console.log('Connected')

//   client.subscribe([topic], () => {
//     console.log(`Subscribe to topic '${topic}'`)
//     client.publish(topic, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
//       if (error) {
//         console.error(error)
//       }
//     })
//   })
// })

// client.on('message', (topic, payload) => {
//   console.log('Received Message:', topic, payload.toString())
// })

// const mqtt = require('mqtt');
// const client = mqtt.connect('mqtt://localhost:1883'); 
// const incomingTopic = 'mailbox/incoming';
// const weightTopic = 'mailbox/weight';
// // const random = require('../scripts/mailNotifier');
// const message = 'test555';
// // const message1 =  random.toString();
// const i = 0;

// function mqttConnection () {
//   client.on('connect', () => {   
//       if (client.connected === true) {
//           console.log('Sucessfully connected'); 
//           // client.publish(topic,message);
//       } else {
//         console.log('Connection error');
//       };
//       // subscribe to a topic
//       client.subscribe(incomingTopic);
//       client.subscribe(weightTopic);
//   });
// }

// //publish message
// function publishMessage () {
//   client.on('message', () => {
//     client.publish(topic, message);
//   });
// }

// // receive a message from the subscribed topic
// client.on('message',(topic, message) => {
//     console.log(`message: ${message}, topic: ${topic}`); 
// });

// // error handling
// client.on('error',(error) => {
//     console.error(error);
//     process.exit(1);
// });

// mqttConnection();
// publishMessage();

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
