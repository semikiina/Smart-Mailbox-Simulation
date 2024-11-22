// Generate random weight between a specified range
const getRandomWeight = (min = 70, max = 350) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate random time intervals between a specified range (in milliseconds)
const getRandomInterval = (min = 5000, max = 10000) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Export the functions for use in other modules
module.exports = { getRandomWeight, getRandomInterval };


// const mqtt = require('mqtt');

// // MQTT Broker configuration
// const brokerUrl = 'mqtt://localhost:1883'; // MQTT Broker URL
// const topic = 'mailbox/weight'; // Topic to publish weight data

// // Function to connect to MQTT Broker
// const client = mqtt.connect(brokerUrl);

// client.on('connect', () => {
//   console.log('Connected to MQTT broker');
//   startRandomNotifications();
// });

// client.on('error', (error) => {
//   console.error('MQTT connection error:', error.message);
// });

// // Generate random weight between 70 and 350 grams
// const getRandomWeight = () => {
//   const min = 70;
//   const max = 350;
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// };

// // Generate random time intervals between 5 and 10 seconds
// const getRandomInterval = () => {
//   const min = 5 * 1000; // 5 seconds
//   const max = 10 * 1000; // 10 seconds
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// };

// // Send the random weight data to MQTT broker
// const sendMailNotification = async () => {
//   try {
//     const weight = getRandomWeight();
//     const data = { weight: weight, date: new Date().toISOString() };

//     // Publish data to MQTT topic
//     client.publish(topic, JSON.stringify(data), { qos: 2 }, (err) => {
//       if (err) {
//         console.error('Error publishing message:', err);
//       } else {
//         console.log(`Notification sent: Weight = ${weight} grams`);
//       }
//     });
//   } catch (error) {
//     console.error('Error sending notification:', error.message);
//   }
// };

// // Random notification process
// const startRandomNotifications = () => {
//   const interval = getRandomInterval();

//   console.log(`Next mail notification will be sent in ${interval / 1000} seconds...`);

//   setTimeout(async () => {
//     await sendMailNotification();

//     // Loop the process
//     startRandomNotifications();
//   }, interval);
// };

// // Start the process
// startRandomNotifications();
