const express = require("express");
const { generateQuiz,getAllQuizzes } =  require("../controllers/QuizController.js");
const {verifyToken} =require("../middleware/VerifyToken.js");

const router = express.Router();

router.post("/generate-quiz", verifyToken, generateQuiz);
router.get("/getallquiz", verifyToken, getAllQuizzes);

module.exports = router;