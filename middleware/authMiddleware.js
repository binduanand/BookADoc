const jwt = require("jsonwebtoken");


exports.protect = (req, res, next) => {
  let token;

  if (req.headers.authorization) {
    const authHeader = req.headers.authorization;

    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      token = authHeader;
    }
  }

  if (!token) {
    return res.status(401).json({ msg: "No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

exports.isDoctor = (req, res, next) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ msg: "Doctor access only" });
  }
  next();
};


exports.isPatient = (req, res, next) => {
  if (req.user.role !== "patient") {
    return res.status(403).json({ msg: "Patient access only" });
  }
  next();
};
