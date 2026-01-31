const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/VerifyToken");
const {
  signup,
  login,
  sendOtp,
  logout,
  checkAuth,
  retakeOnboarding,
} = require("../controllers/Auth");


router.post("/signup", signup);


router.post("/login", login);

router.post("/send-otp", sendOtp);


router.post("/logout", verifyToken, logout);

router.get("/check-auth", verifyToken, checkAuth);

router.put("/retake-onboarding", verifyToken, retakeOnboarding);

module.exports = router;