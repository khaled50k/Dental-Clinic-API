const Patient = require("../models/Patient");
const {
  createPatientSchema,
  updatePatientSchema,
} = require("../validation/patientValidation");

// Create a new patient
exports.createPatient = async (req, res) => {
  try {
    const { error, value } = createPatientSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details });
    }

    const patient = new Patient(value);
    await patient.save();

    res.status(201).json({ message: "Patient created successfully.", patient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Get a specific patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ error: "Patient not found." });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Update a patient by ID
exports.updatePatient = async (req, res) => {
  try {
    const { error, value } = updatePatientSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details });
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ error: "Patient not found." });
    }

    res
      .status(200)
      .json({ message: "Patient updated successfully.", updatedPatient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Delete a patient by ID
exports.deletePatient = async (req, res) => {
  try {
    const deletedPatient = await Patient.findByIdAndRemove(req.params.id);

    if (!deletedPatient) {
      return res.status(404).json({ error: "Patient not found." });
    }

    res
      .status(200)
      .json({ message: "Patient deleted successfully.", deletedPatient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};
