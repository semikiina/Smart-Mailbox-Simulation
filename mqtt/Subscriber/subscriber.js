const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost');

client.on('connect', () => {
    client.subscribe('test/topic', () => {
        console.log('Subscribed to test/topic');
    });
});

client.on('message', (topic, message) => {
    console.log(`Received message: ${message.toString()}`);
});