const Joi = require("joi");

// Patient registration schema
const createPatientSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  dateOfBirth: Joi.date().required(),
  gender: Joi.string().valid("Male", "Female").required(),
  phoneNumber: Joi.string().min(10).max(15).required(),
  email: Joi.string().email().required(),
  address: Joi.string().max(100),
  bloodGroup: Joi.string().valid(
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-"
  ),
  height: Joi.number().min(0).max(300),
  weight: Joi.number().min(0).max(500),
  notes: Joi.string().max(500),
  foodAllergy: Joi.string().max(100),
  heartDisease: Joi.string().max(100),
  highBloodPressure: Joi.boolean(),
  diabetic: Joi.boolean(),
  surgery: Joi.boolean(),
  accident: Joi.boolean(),
  otherConditions: Joi.string().max(200),
  familyMedicalHistory: Joi.string().max(200),
  currentMedication: Joi.string().max(200),
  pregnancy: Joi.boolean(),
  breastfeeding: Joi.boolean(),
  healthInsurance: Joi.boolean(),
  status: Joi.string().valid("Active", "Inactive", "Suspended").default("Active"),
});

// Schema for updating a patient
const updatePatientSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  dateOfBirth: Joi.date(),
  gender: Joi.string().valid("Male", "Female"),
  phoneNumber: Joi.string().min(10).max(15),
  email: Joi.string().email(),
  address: Joi.string().max(100),
  bloodGroup: Joi.string().valid(
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-"
  ),
  height: Joi.number().min(0).max(300),
  weight: Joi.number().min(0).max(500),
  notes: Joi.string().max(500),
  foodAllergy: Joi.string().max(100),
  heartDisease: Joi.string().max(100),
  highBloodPressure: Joi.boolean(),
  diabetic: Joi.boolean(),
  surgery: Joi.boolean(),
  accident: Joi.boolean(),
  otherConditions: Joi.string().max(200),
  familyMedicalHistory: Joi.string().max(200),
  currentMedication: Joi.string().max(200),
  pregnancy: Joi.boolean(),
  breastfeeding: Joi.boolean(),
  healthInsurance: Joi.boolean(),
  status: Joi.string().valid("Active", "Inactive", "Suspended"),
});

module.exports = {
  createPatientSchema,
  updatePatientSchema,
};
