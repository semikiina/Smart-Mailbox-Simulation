// app.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./config/database');
const mainRoute = require('./routes/index');

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', mainRoute);

// Database connection and server start
sequelize.sync().then(() => {
  app.listen(1080, () => {
    console.log('Server is running on http://localhost:1080');
  });
}).catch(err => console.error('Unable to connect to the database:', err));
