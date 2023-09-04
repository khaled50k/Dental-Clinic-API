const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB Connection Successful!");
  } catch (error) {
    console.error("DB Connection Failed:", error);
  }
};

module.exports = connectDB;
