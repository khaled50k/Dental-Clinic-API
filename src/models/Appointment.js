const mongoose = require("mongoose");

// Define the Appointment Schema
const appointmentSchema = new mongoose.Schema(
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
    appointmentDateTime: {
      type: Date,
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Canceled"],
      default: "Scheduled",
    },
  },
  {
    timestamps: true,
  }
);

// Ensure that the duration is greater than 0
appointmentSchema.path("durationMinutes").validate(function (value) {
  return value > 0;
}, "Duration must be greater than 0");

// Index on dentist and appointment start time
appointmentSchema.index(
  { dentist: 1, appointmentDateTime: 1 },
  { unique: true }
);

// Define a virtual for appointmentEnd
appointmentSchema.virtual("appointmentEnd").get(function () {
  return new Date(
    this.appointmentDateTime.getTime() + this.durationMinutes * 60000
  );
});

// Apply the virtual to your schema
appointmentSchema.set("toObject", { virtuals: true });
appointmentSchema.set("toJSON", { virtuals: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
