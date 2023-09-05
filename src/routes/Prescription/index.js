const express = require("express");
const router = express.Router();
const { createPrescription, updatePrescription, deletePrescription, getPrescriptions } = require("../../controllers/prescriptionController");

// Create a new prescription
router.post("/", createPrescription);

// Get a specific prescription by ID or a paginated list of prescriptions
router.get("/:idOrPage?", getPrescriptions);

// Update a prescription by ID
router.put("/:id", updatePrescription);

// Delete a prescription by ID
router.delete("/:id", deletePrescription);

module.exports = router;
