const express = require("express");
const router = express.Router();
const {
  createPrescription,
  getPrescriptions,
  updatePrescription,
  deletePrescription,
  getPrescriptionsByPatientId,
  getPrescriptionsByDentistId,
} = require("../../controllers/prescriptionController");

// Create a new prescription
router.post("/", createPrescription);

// Get prescriptions based on ID or pagination
router.get("/:idOrPage?", getPrescriptions);

// Update a prescription by ID
router.put("/:id", updatePrescription);

// Delete a prescription by ID
router.delete("/:id", deletePrescription);

// Get prescriptions by patient ID
router.get("/patient/:patientId", getPrescriptionsByPatientId);

// Get prescriptions by dentist ID
router.get("/dentist/:dentistId", getPrescriptionsByDentistId);

module.exports = router;
