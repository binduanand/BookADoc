const express = require("express");
const router = express.Router();

const { register, login, getMe } = require("../controllers/authController");
const validate = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validators/authValidator");
const { protect } = require("../middleware/authMiddleware");


router.get("/me", protect, getMe);


router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

module.exports = router;
