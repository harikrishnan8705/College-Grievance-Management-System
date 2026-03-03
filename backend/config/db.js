const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost/express');
    console.log("MongoDB Connected Successfully ✅");
  } catch (error) {
    console.log("MongoDB Connection Failed ❌", error);
    process.exit(1);
  }
};

module.exports = connectDB;
//'mongodb://localhost/express'
