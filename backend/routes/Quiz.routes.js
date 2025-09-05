const express = require("express");
const { generateQuiz,getAllQuizzes,submitQuiz } =  require("../controllers/QuizController.js");
const {verifyToken} =require("../middleware/VerifyToken.js");

const router = express.Router();
console.log("generateQuiz:", generateQuiz);
console.log("getAllQuizzes:", getAllQuizzes);
console.log("submitQuiz:", submitQuiz);
console.log("verifyToken:", verifyToken);

router.post("/generate-quiz", verifyToken, generateQuiz);
router.get("/getallquiz", verifyToken, getAllQuizzes);
router.post("/submitquiz", verifyToken, submitQuiz);

module.exports = router;