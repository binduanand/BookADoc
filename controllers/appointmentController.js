const Appointment = require("../models/Appointment");
const User = require("../models/User");


exports.bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, date, time } = req.body;

    
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ msg: "Doctor not found" });
    }

    
    const day = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    
    const dayAvailability = doctor.availability.find(
      (slot) => slot.day === day
    );

    if (!dayAvailability) {
      return res.status(400).json({ msg: "Doctor not available on this day" });
    }

    
    if (!dayAvailability.times.includes(time)) {
      return res
        .status(400)
        .json({ msg: "Doctor not available at this time" });
    }

    
    const exists = await Appointment.findOne({
      doctor: doctorId,
      date,
      time,
      status: "booked",
    });

    if (exists) {
      return res.status(400).json({ msg: "Slot already booked" });
    }

    
    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      date,
      time,
    });

    res.json(appointment);
  } catch (err) {
    next(err);
  }
};


exports.cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    if (appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.json({ msg: "Appointment cancelled" });
  } catch (err) {
    next(err);
  }
};


exports.getDoctorAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user.id,
    }).populate("patient", "name email");

    res.json(appointments);
  } catch (err) {
    next(err);
  }
};


exports.addPrescription = async (req, res, next) => {
  try {
    const { prescription } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    appointment.prescription = prescription;
    appointment.status = "completed";

    await appointment.save();

    res.json(appointment);
  } catch (err) {
    next(err);
  }
};


exports.getMyAppointments = async (req, res, next) => {
  try {
    if (req.user.role !== "patient") {
      return res.status(403).json({ msg: "Patients only" });
    }

    const appointments = await Appointment.find({
      patient: req.user.id,
    })
      .populate("doctor", "name specialization city fee")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (err) {
    next(err);
  }
};
