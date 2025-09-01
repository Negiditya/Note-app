const express = require("express");
const { register, login, verifyOtp } = require("../controllers/authController");
const router = express.Router();


// Route: Register user and send OTP
router.post("/register", register);


// Route: Login (just sends OTP to existing user)
router.post("/login", login);

// Route: Verify OTP (for both register & login)
router.post("/verify-otp", verifyOtp);

module.exports = router;

