// app.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const connectDatabase = require('./config/dbconfig');
const app = express();
const { initializeMqtt } = require('./mqtt/mqttConnection');

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

initializeMqtt();

app.listen(1080, () => {
  connectDatabase().catch(console.error); 
  console.log('Server is running on http://localhost:1080');
});