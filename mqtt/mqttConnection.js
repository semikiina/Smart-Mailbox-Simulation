const mqtt = require('mqtt');

// Initialize MQTT connection only once
let client;

function initializeMqtt() {
    if (!client) {
        // Erstelle nur eine Verbindung
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

// Export the client object and the initialization function
module.exports = { initializeMqtt };
