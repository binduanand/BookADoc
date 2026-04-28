const Joi = require("joi");

exports.registerSchema = Joi.object({
  name: Joi.string().min(3).trim().required(),

  email: Joi.string().email().lowercase().trim().required(),

  password: Joi.string().min(6).required(),

  role: Joi.string().valid("patient", "doctor").required(),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),

  password: Joi.string().required(),
});
