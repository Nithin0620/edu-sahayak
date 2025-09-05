const express = require("express");
const router = express.Router();
const flashcardController = require("../controllers/flashcardController");
const {verifyToken} = require("../middleware/VerifyToken")
// Fetch all flashcards
router.get("/getallflashcards",verifyToken, flashcardController.getAllFlashcards);

// Generate new flashcards
router.post("/flashcard/generate", verifyToken,flashcardController.generateFlashcards);

// Fetch flashcards by CID
// router.get("/flas/:cid", flashcardController.getFlashcardsByCid);

module.exports = router;
