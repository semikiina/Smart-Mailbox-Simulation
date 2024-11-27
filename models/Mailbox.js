const mongoose = require('mongoose');

// Define the Mailbox schema
const MailboxSchema = new mongoose.Schema({
  weight: { type: Number, required: true },
  timestamp: { type: Date, required: true },
  totalWeight: { type: Number, required: true },
  mailCount: { type: Number, required: true },
});

// Create the Mailbox model
module.exports = mongoose.model('Mailbox', MailboxSchema);