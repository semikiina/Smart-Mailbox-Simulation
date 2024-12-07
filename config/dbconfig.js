const mongoose = require('mongoose');

// MongoDB connection logic
const connectDatabase = async () => {
  const MONGO_URI = 'mongodb+srv://admin:3G3IAvJQGxr17D24@mailbox.bekir.mongodb.net/?retryWrites=true&w=majority&appName=mailbox';

  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
};

module.exports = connectDatabase;
