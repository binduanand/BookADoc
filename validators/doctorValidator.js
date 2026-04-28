const Joi = require("joi");

exports.updateDoctorSchema = Joi.object({
  specialization: Joi.string().optional(),

  fee: Joi.number().min(0).optional(),

  city: Joi.string().optional(),

  availability: Joi.array()
    .items(
      Joi.object({
        day: Joi.string()
          .valid(
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
          )
          .required(),

        times: Joi.array()
          .items(
            Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
          )
          .min(1)
          .required(),
      })
    )
    .optional(),
});
 
