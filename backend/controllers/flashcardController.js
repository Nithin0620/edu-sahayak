const Flashcard = require("../models/Flashcard");
const axios = require("axios");

exports.getAllFlashcards = async (req, res) => {
  try {
    const flashcards = await Flashcard.find();
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch flashcards" });
  }
};

exports.generateFlashcards = async (req, res) => {
  try {
    const { cid, count } = req.body;

    if (!cid || !count) {
      return res.status(400).json({ error: "cid and count are required" });
    }

    const apiUrl = `http://InsaneJSK-Code4Bharat-API.hf.space/generate-flashcards?cid=${encodeURIComponent(
      cid
    )}&count=${count}`;

    // Call external API
    const response = await axios.get(apiUrl);
    const generatedCards = response.data;

    // Save into DB
    const savedCards = await Flashcard.insertMany(generatedCards);

    res.json(savedCards);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate flashcards" });
  }
};

// // 3. Fetch flashcards by CID
// exports.getFlashcardsByCid = async (req, res) => {
//   try {
//     const { cid } = req.params;
//     const flashcards = await Flashcard.find({ cid });

//     if (flashcards.length === 0) {
//       return res.status(404).json({ message: "No flashcards found" });
//     }

//     res.json(flashcards);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch flashcards by cid" });
//   }
// };
