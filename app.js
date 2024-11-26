const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const connectDatabase = require('./config/dbconfig'); // Verbindung zur Datenbank
const { initializeMqtt } = require('./mqtt/mqttConnection'); // Importiere die MQTT-Initialisierung
const { initializeMailController } = require('./controllers/mailController'); // Importiere den Mail Controller

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.listen(1080, () => {
  connectDatabase().then(() => {
    console.log('Connected to MongoDB');
    // Initialisierungen
    initializeMqtt(); // MQTT-Verbindung initialisieren
    initializeMailController(); // Mail Controller starten

  }
  ).catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
  console.log('Server is running on http://localhost:1080');
});
