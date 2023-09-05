const Prescription = require("../models/Prescription");
const { prescriptionSchema } = require("../validation/prescriptionValidation");

// Create a new prescription
exports.createPrescription = async (req, res) => {
  try {
    const { error, value } = prescriptionSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details });
    }

    const prescription = new Prescription(value).populate("patient doctor");;
    await prescription.save();

    res
      .status(201)
      .json({ message: "Prescription created successfully.", prescription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Get prescriptions based on ID or pagination
exports.getPrescriptions = async (req, res) => {
  try {
    const idOrPage = req.params.idOrPage;

    // Check if idOrPage is a number (page) or not (id)
    if (!isNaN(idOrPage)) {
      // It's a page number, handle pagination logic here
      const page = parseInt(idOrPage);

      // Validate that the page is at least 1
      if (page < 1) {
        return res.status(400).json({ error: "Page must be at least 1." });
      }
      // Your pagination logic goes here
      // Example: Fetch the 10 prescriptions for the specified page
      const prescriptionsPerPage = 10;
      const skip = (page - 1) * prescriptionsPerPage;
      const prescriptions = await Prescription.find()
        .populate("patient doctor")
        .skip(skip)
        .limit(prescriptionsPerPage);

      res.status(200).json(prescriptions);
    } else {
      // It's an ID, handle retrieving a specific prescription by ID here
      const prescription = await Prescription.findById(idOrPage).populate(
        "patient doctor"
      );
      if (!prescription) {
        return res.status(404).json({ error: "Prescription not found." });
      }
      res.status(200).json(prescription);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};
// Update a prescription by ID
exports.updatePrescription = async (req, res) => {
  try {
    const { error, value } = prescriptionSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details });
    }

    const updatedPrescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true }
    );

    if (!updatedPrescription) {
      return res.status(404).json({ error: "Prescription not found." });
    }

    res
      .status(200)
      .json({
        message: "Prescription updated successfully.",
        updatedPrescription,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Delete a prescription by ID
exports.deletePrescription = async (req, res) => {
  try {
    const deletedPrescription = await Prescription.findByIdAndRemove(
      req.params.id
    );

    if (!deletedPrescription) {
      return res.status(404).json({ error: "Prescription not found." });
    }

    res
      .status(200)
      .json({
        message: "Prescription deleted successfully.",
        deletedPrescription,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};
