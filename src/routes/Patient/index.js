const express = require("express");
const router = express.Router();
const {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} = require("../../controllers/patientController");
const {
  createPatientSchema,
  updatePatientSchema,
} = require("../../validation/patientValidation");

// Create a new patient
router.post("/", createPatient);

// Get all patients
router.get("/", getAllPatients);

// Get a specific patient by ID
router.get("/:id", getPatientById);

// Update a patient by ID
router.put("/:id", updatePatient);

// Delete a patient by ID
router.delete("/:id", deletePatient);

module.exports = router;
