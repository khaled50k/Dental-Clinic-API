const mongoose = require("mongoose");

// Define the Prescription Schema
const prescriptionSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    dentist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dentist",
      required: true,
    },
    prescriptionDate: {
      type: Date,
      required: true,
    },
    weight: Number,
    height: Number,
    bloodPressure: String,
    chiefComplaint: String,
    medicines: [
      {
        medicineName: String,
        medicineType: String,
        instructions: String,
        days: Number,
      },
    ],
    diagnoses: [
      {
        diagnosis: String,
        diagnosisInstructions: String,
      },
    ],
    notes: String,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);
module.exports = { Prescription}
