const Joi = require("joi");

// Registration schema
const registrationSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  specialization: Joi.string().alphanum().max(20).required(),
  phoneNumber: Joi.string().min(10).max(13).required(),
  email: Joi.string().email().required(),
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(16)
    .custom((value, helpers) => {
      // Use a regular expression to check if the username contains only letters and numbers
      if (/^[a-zA-Z0-9]+$/.test(value)) {
        return value; // Valid username
      }
      return helpers.message("Username must contain only letters and numbers");
    }),
  password: Joi.string()
    .min(6)
    .max(16)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[_$@]).+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one of the following characters: _, $, @",
    }),
});

// Login schema
const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = {
  registrationSchema,
  loginSchema,
};
