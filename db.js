const mongoose = require("mongoose");
require('dotenv').config()

const mongoURI = process.env.MONGO_URI
async function connectMongo() {
  try {
    await mongoose.connect(mongoURI);
    console.log("Successfully connected to Database.");
    return mongoose.connection;
  } catch (err) {
    console.log("The error is " + err);
  }
}
 



module.exports = {
  connectMongo,
};
