const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendOtp = require("../utils/sendOtp");
const generateOtp = require("../utils/generateOtp")

// register controller
const register = async (req, res) => {
    try {
        const { name, email, dob } = req.body;
        const user = await User.findOne({ email });

        if (user && user.isVerified) {
            // Case 1: User already registered and verified
            return res.status(400).json({ message: "Email is already registered, login" });
        }

        // Generate OTP
        const otp = generateOtp()

        // Hash the OTP
        const hashedOtp = await bcrypt.hash(otp, 10);

        // OTP expiry (10 minutes)
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        if (user) {
            // Case 2: User exists but not verified — update OTP and expiry
            user.hashedOtp = hashedOtp;
            user.otpExpiry = otpExpiry;
            await user.save();
        } else {
            // Case 3: New user — create entry with OTP
            await User.create({
                name,
                email,
                dob,
                hashedOtp,
                otpExpiry,
                isVerified: false,
            });
        }

        // Send OTP via email
        await sendOtp(email, otp);

        res.status(200).json({ message: "OTP sent to your email" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// login controller
const login = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user || !user.isVerified) {
            return res.status(400).json({ message: "User not registered or not verified" });
        }

        // Generate OTP
        const otp = generateOtp()

        // Hash OTP
        const hashedOtp = await bcrypt.hash(otp, 10);

        // OTP expiry
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        // Update OTP for existing user
        user.hashedOtp = hashedOtp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Send OTP via email
        await sendOtp(email, otp);

        res.status(200).json({ message: "OTP sent to your email"});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            // Case 1: No account found
            return res.status(400).json({ message: "User not found" });
        }

        // Case 2: OTP expired
        if (user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        // Compare entered OTP with hashed OTP
        const isMatch = await bcrypt.compare(otp, user.hashedOtp);
        if (!isMatch) {
            // Case 3: Wrong OTP
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // OTP is valid → mark user verified
        user.isVerified = true;
        user.hashedOtp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        // Generate JWT token after successful verification
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.status(200).json({
            message: "OTP verified successfully",
            token,
            user: {name: user.name, email: user.email}
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {register, login , verifyOtp}