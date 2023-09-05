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
    height: {
      type: Number,
      default: null, // Default value for height
    },
    weight: {
      type: Number,
      default: null, // Default value for weight
    },
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
    highBloodPressure: {
      type: Boolean,
      default: false, // Default value for highBloodPressure
    },
    diabetic: {
      type: Boolean,
      default: false, // Default value for diabetic
    },
    surgery: {
      type: Boolean,
      default: false, // Default value for surgery
    },
    accident: {
      type: Boolean,
      default: false, // Default value for accident
    },
    otherConditions: String,
    familyMedicalHistory: String,
    currentMedication: String,
    pregnancy: {
      type: Boolean,
      default: false, // Default value for pregnancy
    },
    breastfeeding: {
      type: Boolean,
      default: false, // Default value for breastfeeding
    },
    healthInsurance: {
      type: Boolean,
      default: false, // Default value for healthInsurance
    },
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
