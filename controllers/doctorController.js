const User = require("../models/User");


exports.getDoctors = async (req, res, next) => {
  try {
    const { specialization, city, minFee, maxFee } = req.query;

    
    let query = { role: "doctor" };

    if (specialization) {
      query.specialization = { $regex: specialization, $options: "i" };
    }

    if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    if (minFee || maxFee) {
      query.fee = {};
      if (minFee) query.fee.$gte = Number(minFee);
      if (maxFee) query.fee.$lte = Number(maxFee);
    }

    const doctors = await User.find(query)
      .select("-password")
      .sort({ fee: 1 });

    res.json(doctors);
  } catch (err) {
    next(err);
  }
};


exports.updateDoctorProfile = async (req, res, next) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ msg: "Doctors only" });
    }

    const { specialization, fee, city, availability } = req.body;

    const doctor = await User.findById(req.user.id);

    if (!doctor) {
      return res.status(404).json({ msg: "Doctor not found" });
    }

    
    if (specialization) doctor.specialization = specialization;
    if (fee !== undefined) doctor.fee = fee;
    if (city) doctor.city = city;

    
    if (availability) {
      
      const days = availability.map((a) => a.day);
      const uniqueDays = new Set(days);

      if (days.length !== uniqueDays.size) {
        return res.status(400).json({ msg: "Duplicate days not allowed" });
      }

      doctor.availability = availability;
    }

    await doctor.save();

    res.json(doctor);
  } catch (err) {
    next(err);
  }
};
