const mongoose = require("mongoose");

// Define the Patient Schema
const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // Add validation for email format here if needed
    },
    address: String,
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      default: null, // You can set a default value if needed
    },
    notes: String,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Patient = mongoose.model("Patient", patientSchema);
module.exports = { Patient };
