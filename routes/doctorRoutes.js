const express = require("express");
const router = express.Router();

const validate = require("../middleware/validate");
const { updateDoctorSchema } = require("../validators/doctorValidator");

const {
  getDoctors,
  updateDoctorProfile
} = require("../controllers/doctorController");

const { protect, isDoctor } = require("../middleware/authMiddleware");


router.get("/", getDoctors);


router.put(
  "/profile",
  protect,
  isDoctor,
  validate(updateDoctorSchema),
  updateDoctorProfile
);

module.exports = router;
