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
    height: Number, // New field for Height
    weight: Number, // New field for Weight
    notes: String,
    prescriptionHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prescription",
      },
    ],
    // Case Study Fields
    foodAllergy: String,
    heartDisease: String,
    highBloodPressure: Boolean,
    diabetic: Boolean,
    surgery: Boolean,
    accident: Boolean,
    otherConditions: String,
    familyMedicalHistory: String,
    currentMedication: String,
    pregnancy: Boolean,
    breastfeeding: Boolean,
    healthInsurance: Boolean,
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
