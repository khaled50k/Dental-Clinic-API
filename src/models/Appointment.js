const mongoose = require('mongoose');

// Define the Appointment Schema
const appointmentSchema = new mongoose.Schema({
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    dentist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dentist',
      required: true,
    },
    appointmentStart: {
      type: Date,
      required: true,
    },
    appointmentEnd: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Canceled'],
      default: 'Scheduled',
    },
  }, {
    timestamps: true,
  });
  appointmentSchema.index(
    { dentist: 1, appointmentStart: 1, appointmentEnd: 1 },
    { unique: true }
 );
 
const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = { Appointment };