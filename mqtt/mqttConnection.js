const mqtt = require('mqtt');

// MQTT-Verbindung initialisieren
const client = mqtt.connect('mqtt://localhost:1883'); // Lokale MQTT-Instanz

client.on('connect', () => {
    console.log('Connected to MQTT broker');
});

// Funktion zur weiteren Initialisierung, falls erforderlich
function initializeMqtt() {
    console.log('MQTT connection initialized');
}

module.exports = { client, initializeMqtt };
