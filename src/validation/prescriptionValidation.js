const Joi = require("joi");

const prescriptionSchema = Joi.object({
  patient: Joi.string().required().min(1).max(100), // Adjust min and max lengths as needed
  dentist: Joi.string().required().min(1).max(100), // Adjust min and max lengths as needed
  prescriptionDate: Joi.date().required(),
  chiefComplaint: Joi.string().max(255), // Adjust max length as needed
  medicines: Joi.array().items(
    Joi.object({
      medicineName: Joi.string().required().min(1).max(100), // Adjust min and max lengths as needed
      medicineType: Joi.string().max(50), // Adjust max length as needed
      instructions: Joi.string().max(255), // Adjust max length as needed
      days: Joi.number().integer().min(1), // Adjust min value as needed
    })
  ),
  diagnoses: Joi.array().items(
    Joi.object({
      diagnosis: Joi.string().max(255), // Adjust max length as needed
      diagnosisInstructions: Joi.string().max(255), // Adjust max length as needed
    })
  ),
  notes: Joi.string().max(1000), // Adjust max length as needed
});

module.exports = {
  prescriptionSchema,
};
