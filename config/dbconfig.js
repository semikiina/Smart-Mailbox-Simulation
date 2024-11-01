const mongoose = require('mongoose');

const uri = "mongodb+srv://admin:3G3IAvJQGxr17D24@mailbox.bekir.mongodb.net/?retryWrites=true&w=majority&appName=mailbox";

const clientOptions = { 
    serverApi: { 
        version: '1', 
        strict: true, 
        deprecationErrors: true 
    } 
};

module.exports = async function connectDatabase() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
  }

