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
// Get a specific patient by ID or a paginated list of patients
exports.getPatientByIdOrList = async (req, res) => {
  try {
    const idOrPage = req.params.idOrPage ?? 1;

    // Check if idOrPage is a number (page) or not (id)
    if (!isNaN(idOrPage)) {
      // It's a page number, handle pagination logic here
      const page = parseInt(idOrPage);

      // Validate that the page is at least 1
      if (page < 1) {
        return res.status(400).json({ error: "Page must be at least 1." });
      }

      // Your pagination logic goes here
      // Example: Fetch the 10 patients for the specified page
      const patientsPerPage = 10;
      const skip = (page - 1) * patientsPerPage;
      const patients = await Patient.find().skip(skip).limit(patientsPerPage);

      res.status(200).json(patients);
    } else {
      // It's an ID, handle retrieving a specific patient by ID here
      const patient = await Patient.findById(idOrPage);
      if (!patient) {
        return res.status(404).json({ error: "Patient not found." });
      }
      res.status(200).json(patient);
    }
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

    res.status(200).json({ message: "Patient deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};
