const mqtt = require('mqtt');

// Verbinde dich mit dem MQTT-Broker
const client = mqtt.connect('mqtt://localhost');

// Maximale Kapazität der Mailbox (in Gramm)
const MAILBOX_CAPACITY = 5000; // Beispiel: 5kg

// Aktuelle Mail-Daten (Größe in Gramm und Anzahl der Briefe)
let currentWeight = 0;
let mailCount = 0;

// Initialisierung des MailControllers
const initializeMailController = () => {
  console.log('Mail Controller initialized and listening to MQTT messages');

  // Abonniere das 'mailbox/weight' Thema
  client.subscribe('mailbox/weight', (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to mailbox/weight topic');
    }
  });

  // Verarbeite empfangene Nachrichten
  client.on('message', (topic, message) => {
    if (topic === 'mailbox/weight') {
      const payload = JSON.parse(message.toString());
      const { weight, timestamp } = payload;

      // Aktualisiere das Gewicht und die Anzahl der Briefe
      currentWeight += weight;
      mailCount += 1;

      // Ausgabe im Terminal
      console.log(`Received new mail at ${timestamp}:`);
      console.log(`  - Weight of current mail: ${weight} grams`);
      console.log(`  - Total number of letters: ${mailCount}`);
      console.log(`  - Total weight in mailbox: ${currentWeight} grams`);

      // Überprüfen, ob die Mailbox voll ist
      if (currentWeight >= MAILBOX_CAPACITY) {
        console.log('Mailbox is full!');
      } else {
        console.log('Mailbox is not full yet.');
      }
    }
  });
};

// Fehlerbehandlung für den MQTT-Client
client.on('error', (err) => {
  console.error('MQTT client error:', err);
});

// Initialisiere den MailController
initializeMailController();

module.exports = { initializeMailController };
