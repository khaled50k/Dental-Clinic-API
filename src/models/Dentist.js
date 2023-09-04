const mongoose = require("mongoose");

// Define the Dentist Schema
const dentistSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    specialization: String,
    contactNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // Add validation for email format here if needed
    },
  },
  {
    timestamps: true,
  }
);
const Dentist = mongoose.model("Dentist", dentistSchema);
module.exports = { Dentist };
