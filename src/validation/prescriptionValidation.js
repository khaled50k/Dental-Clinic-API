const Joi = require("joi");

const prescriptionSchema = Joi.object({
  patient: Joi.string().required(),
  dentist: Joi.string().required(),
  prescriptionDate: Joi.date().required(),
  chiefComplaint: Joi.string(),
  medicines: Joi.array().items(
    Joi.object({
      medicineName: Joi.string().required(),
      medicineType: Joi.string(),
      instructions: Joi.string(),
      days: Joi.number(),
    })
  ),
  diagnoses: Joi.array().items(
    Joi.object({
      diagnosis: Joi.string(),
      diagnosisInstructions: Joi.string(),
    })
  ),
  notes: Joi.string(),
});

module.exports = {
  prescriptionSchema,
};
