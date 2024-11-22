const mqtt = require('mqtt');

// Konfiguration des MQTT Brokers
const client = mqtt.connect('mqtt://localhost'); // Der Broker läuft auf localhost

// Funktion zur Erzeugung eines zufälligen Gewichts
const getRandomWeight = (min = 70, max = 350) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Funktion zur Erzeugung von zufälligen Zeitintervallen
const getRandomInterval = (min = 5000, max = 10000) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Funktion zur Veröffentlichung von Gewicht und Datum an MQTT
const publishWeight = () => {
  // Erzeuge zufälliges Gewicht und Datum
  const weight = getRandomWeight();
  const timestamp = new Date().toISOString(); // Aktuelles Datum im ISO-Format
  
  const payload = JSON.stringify({ weight, timestamp });

  // Veröffentliche das Gewicht auf dem Thema 'mailbox/weight'
  client.publish('mailbox/weight', payload, () => {
    console.log(`Published: ${payload}`);
  });
};

// Verbindung zum Broker herstellen und Nachrichten regelmäßig senden
client.on('connect', () => {
  console.log('Connected to MQTT broker');

  // Alle 5-10 Sekunden eine Nachricht senden
  setInterval(() => {
    publishWeight();
  }, getRandomInterval());
});

// Fehlerbehandlung
client.on('error', (err) => {
  console.error('Error:', err);
});

module.exports = { getRandomWeight, getRandomInterval };
