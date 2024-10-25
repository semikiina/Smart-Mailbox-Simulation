const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost');

client.on('connect', () => {
    client.publish('test/topic', 'Hello from Node.js');
    client.end();
});
