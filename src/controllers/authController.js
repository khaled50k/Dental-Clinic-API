const bcrypt = require("bcrypt");
const Dentist = require("../models/Dentist"); // Assuming you have a Dentist model
const {
  registrationSchema,
  loginSchema,
} = require("../validation/authValidation");

exports.register = async (req, res) => {
  try {
    const { name, specialization, phoneNumber, email, username, password } =
      req.body;

    // Validate the input data
    const { error } = registrationSchema.validate({
      name,
      specialization,
      phoneNumber,
      email,
      username,
      password,
    });

    if (error) {
      return res.status(400).json({ errors: error.details });
    }
    // Check if the email address is already taken

    const dentistExists = await Dentist.findOne({ email });
    if (dentistExists) {
      return res
        .status(400)
        .json({ error: "This email address is already taken." });
    }

    // Create a new dentist document
    const dentist = new Dentist({
      name,
      specialization,
      phoneNumber,
      email,
      username,
      password,
    });

    // Save the dentist document to the database
    await dentist.save();

    // Set the response
    res.status(201).json({ message: "Dentist registered successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate the input data
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Please provide all required information." });
    }
    const { error } = loginSchema.validate({ username, password });
    if (error) {
      return res.status(400).json({ errors: error.details });
    }

    // Find the dentist by email address
    const dentist = await Dentist.findOne({ username: username });
    if (!dentist) {
      return res.status(404).json({ errors: "Dentist not found." });
    }

    // Compare the password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(password, dentist.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid password." });
    }
    const userWithoutSensitiveData = {
      _id: dentist._id,
      firstName: dentist.firstName,
      lastName: dentist.lastName,
      specialization: dentist.specialization,
      contactNumber: dentist.contactNumber,
      email: dentist.email,
      username: dentist.username,
      // Add any other non-sensitive fields here
    };
    // Set the session
    req.session.authenticated = true;
    req.session.user = userWithoutSensitiveData;

    // Set the response
    res.status(200).json({ message: "Login successful." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};
