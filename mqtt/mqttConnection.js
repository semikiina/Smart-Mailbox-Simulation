const mqtt = require('mqtt');

// Initialize MQTT connection
// Connect to the local MQTT broker running on port 1883
const client = mqtt.connect('mqtt://localhost:1883');

// Event listener for successful connection to the MQTT broker
client.on('connect', () => {
    console.log('Connected to MQTT broker');
});

// Optional function for further initialization
// Can be used to add more setup logic if needed in the future
function initializeMqtt() {
    console.log('MQTT connection initialized');
}

// Export the client object and the initialization function
// The `client` is used to publish or subscribe to topics
// The `initializeMqtt` function is a placeholder for additional setup
module.exports = { client, initializeMqtt };