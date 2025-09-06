const express = require("express");
const { getUserQuizScores} =  require("../controllers/Performance.js");
const {verifyToken} =require("../middleware/VerifyToken.js");

const router = express.Router();

router.get("/getuserquizscore", verifyToken, getUserQuizScores);

module.exports = router;