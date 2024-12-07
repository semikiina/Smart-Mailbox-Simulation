const mqtt = require('mqtt');

let client;

function initializeMqtt() {
    if (!client) {

        client = mqtt.connect('mqtt://localhost:1883');

        // Event listener for successful connection to the MQTT broker
        client.on('connect', () => {
            console.log('Connected to MQTT broker');
        });

        client.on('error', (err) => {
            console.error('MQTT connection error:', err);
        });
    } else {
        console.log('MQTT client already initialized');
    }
    return client;
}


module.exports = { initializeMqtt };
