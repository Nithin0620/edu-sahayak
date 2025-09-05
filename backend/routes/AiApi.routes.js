const express = require("express")

const router = express.Router();

// const {getPDFByChapter} = require("../controllers/getPdfByChapter")
const {getTopVideos} = require("../controllers/ytController");
const { getFlashcards } = require("../controllers/flashCards");


router.get("/youtube",getTopVideos);
router.get("/flashcards",getFlashcards);
// router.get("/pdfs",getPDFByChapter);


module.exports = router;