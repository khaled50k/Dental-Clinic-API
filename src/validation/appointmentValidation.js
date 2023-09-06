const Joi = require("joi");

// Define the validation schema for appointments
const appointmentSchema = Joi.object({
  patient: Joi.string().required(),
  dentist: Joi.string().required(),
  appointmentDateTime: Joi.date().required(),
  durationMinutes: Joi.number().integer().min(1).required(),
  status: Joi.string().valid("Scheduled", "Completed", "Canceled").default("Scheduled"),
});

module.exports = {
  appointmentSchema,
};
