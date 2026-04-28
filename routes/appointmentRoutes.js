const express = require("express");
const router = express.Router();

const validate = require("../middleware/validate");
const { bookAppointmentSchema } = require("../validators/appointmentValidator");

const {
  bookAppointment,
  cancelAppointment,
  getDoctorAppointments,
  addPrescription,
  getMyAppointments
} = require("../controllers/appointmentController");

const { protect, isDoctor, isPatient } = require("../middleware/authMiddleware");

// Patient
router.post(
  "/book",
  protect,
  isPatient,
  validate(bookAppointmentSchema),
  bookAppointment
);

router.put("/cancel/:id", protect, cancelAppointment);

router.get("/my", protect, isPatient, getMyAppointments);

// Doctor
router.get("/doctor", protect, isDoctor, getDoctorAppointments);

router.put("/prescription/:id", protect, isDoctor, addPrescription);

module.exports = router;
