const express = require("express");
const router = express.Router();
const {
  createPatient,
  getPatientByIdOrList,
  updatePatient,
  deletePatient,
} = require("../../controllers/patientController");
const {
  createPatientSchema,
  updatePatientSchema,
} = require("../../validation/patientValidation");

// Create a new patient
router.post("/", createPatient);

//  Get a specific patient by ID or a paginated list of patients
router.get("/:idOrPage?", getPatientByIdOrList);

// Update a patient by ID
router.put("/:id", updatePatient);

// Delete a patient by ID
router.delete("/:id", deletePatient);

module.exports = router;
