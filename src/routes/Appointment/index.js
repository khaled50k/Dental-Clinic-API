const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
  suggestAppointments,
  getAvailableHoursForDate,
  getAppointmentsForDate
} = require("../../controllers/appointmentController");

// Create a new appointment
router.post("/", createAppointment);

// Get appointments based on ID or pagination
router.get("/:idOrPage?", getAppointments);

// Update an appointment by ID
router.put("/:id", updateAppointment);

// Delete an appointment by ID
router.delete("/:id", deleteAppointment);

router.get(
  "/dentist/:dentistId/suggest-appointments/:appointmentDateTime",
  suggestAppointments
);

module.exports = router;
