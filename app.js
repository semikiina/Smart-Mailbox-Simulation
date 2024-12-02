const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const connectDatabase = require('./config/dbconfig'); // Database connection
const { initializeMailController } = require('./controllers/mailController'); // Import Mail Controller

const app = express();

// Middleware and settings
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse URL-encoded data and serve static files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(1080, () => {
  connectDatabase()
    .then(() => {
      console.log('Connected to MongoDB');

      // Initialisiere nur den MailController, der die zentrale MQTT-Verbindung nutzt
      initializeMailController();
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB:', err);
      process.exit(1);
    });

  console.log('Server is running on http://localhost:1080');
});
