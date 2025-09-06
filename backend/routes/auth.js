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


router.post("/signup", signup);


router.post("/login", login);

router.post("/send-otp", sendOtp);


router.post("/logout", auth, logout);

router.get("/check-auth", auth, checkAuth);

router.put("/retake-onboarding", auth, retakeOnboarding);

module.exports = router;