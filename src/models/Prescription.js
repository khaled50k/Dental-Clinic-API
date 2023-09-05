const mongoose = require("mongoose");
const {
  getPatientWithoutSensitiveData,
  getDoctorWithoutSensitiveData,
} = require("../utils/populate");

// Define the Prescription Schema
const prescriptionSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      populate: { select: getPatientWithoutSensitiveData },
    },
    dentist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dentist",
      required: true,
      populate: { select: getDoctorWithoutSensitiveData },
    },
    prescriptionDate: {
      type: Date,
      required: true,
    },
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
module.exports = Prescription;
