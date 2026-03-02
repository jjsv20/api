const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const url = process.env.MONGO_URI;
    await mongoose.connect(url);
     console.log("Mongo conectado");
  } catch (error) {
     console.log("Error de conexión", error);
  }
};

module.exports = { connectDB };