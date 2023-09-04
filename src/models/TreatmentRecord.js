const mongoose = require("mongoose");

// Define the TreatmentRecord Schema
const treatmentRecordSchema = new mongoose.Schema(
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
    dateOfTreatment: {
      type: Date,
      required: true,
    },
    treatmentDescription: String,
    cost: {
      type: Number,
      min: 0, // Assuming cost should not be negative
    },
  },
  {
    timestamps: true,
  }
);

const TreatmentRecord = mongoose.model(
  "TreatmentRecord",
  treatmentRecordSchema
);
module.exports = { TreatmentRecord };
