// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mail = sequelize.define('Mail', {
  // TODO: Add the attributes here
});

module.exports = Mail;
