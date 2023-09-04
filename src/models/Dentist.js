const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the Dentist Schema
const dentistSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    specialization: String,
    contactNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // Add validation for email format here if needed
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash and salt the password before saving it to the database
dentistSchema.pre("save", async function (next) {
  const dentist = this;
  if (!dentist.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dentist.password, salt);
    dentist.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

const Dentist = mongoose.model("Dentist", dentistSchema);
module.exports = { Dentist };
