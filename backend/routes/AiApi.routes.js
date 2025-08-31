const express = require("express")

const router = express.Router();

// const {getPDFByChapter} = require("../controllers/getPdfByChapter")
const {getTopVideos} = require("../controllers/ytController")


router.get("/youtube",getTopVideos);
// router.get("/pdfs",getPDFByChapter);


module.exports = router;