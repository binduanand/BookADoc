const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["patient", "doctor"],
      required: true,
    },

   
    specialization: {
      type: String,
    },

    fee: {
      type: Number,
    },

    city: {
      type: String,
    },

    
    availability: [
      {
        day: {
          type: String,
          enum: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          required: true,
        },
        times: [
          {
            type: String, 
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
