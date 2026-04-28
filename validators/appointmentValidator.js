const Joi = require("joi");

exports.bookAppointmentSchema = Joi.object({
  doctorId: Joi.string().hex().length(24).required(),

  date: Joi.date().iso().required(), 

  time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required(),
});
