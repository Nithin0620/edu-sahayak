const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  signup,
  login,
  sendOtp,
  logout,
  checkAuth,
  retakeOnboarding,
} = require("../controllers/Auth");

// @route   POST api/auth/signup
// @desc    Register a new user
// @access  Public
router.post("/signup", signup);

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", login);

// @route   POST api/auth/send-otp
// @desc    Send OTP for email verification
// @access  Public
router.post("/send-otp", sendOtp);

// @route   POST api/auth/logout
// @desc    Logout user
// @access  Private
router.post("/logout", auth, logout);

// @route   GET api/auth/check-auth
// @desc    Check if user is authenticated
// @access  Private
router.get("/check-auth", auth, checkAuth);

// @route   PUT api/auth/retake-onboarding
// @desc    Retake the onboarding assessment
// @access  Private
router.put("/retake-onboarding", auth, retakeOnboarding);

module.exports = router;