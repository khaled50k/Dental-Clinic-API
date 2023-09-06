const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
  suggestAppointments,
  getAvailableHoursForDate,
} = require("../../controllers/appointmentController");

// Create a new appointment
router.post("/", createAppointment);

// Get appointments based on ID or pagination
router.get("/:idOrPage?", getAppointments);

// Update an appointment by ID
router.put("/:id", updateAppointment);

// Delete an appointment by ID
router.delete("/:id", deleteAppointment);

// Additional controller for appointment suggestions
router.get("/dentist/:dentistId/suggest-appointments", suggestAppointments);

// Controller to get available hours for a specific date
router.get(
  "/dentist/:dentistId/available-hours/:appointmentDateTime",
  getAvailableHoursForDate
);

module.exports = router;
