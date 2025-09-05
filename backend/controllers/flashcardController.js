const Flashcard = require("../models/Flashcard");
const axios = require("axios");
const User = require("../models/User");
const ChatSession = require("../models/ChatSessions");
const SetFlash = require("../models/SetsFlash");
const { v4: uuidv4 } = require("uuid");

exports.getAllFlashcards = async (req, res) => {
  try {
    // populate so you can see cards inside each set
    const flashcardSets = await SetFlash.find().populate("cards");
    res.json(flashcardSets);
  } catch (error) {
    console.error("Error fetching flashcards:", error.message);
    res.status(500).json({ error: "Failed to fetch flashcards" });
  }
};

exports.generateFlashcards = async (req, res) => {
  try {
    const { sessionId, count, class_num, subject, chapter } = req.body;
    const userId = req.user.userId;

    if (!class_num || !subject || !chapter) {
      return res.status(400).json({
        success: false,
        message: "Required fields: class_num, subject, chapter",
      });
    }

    let session, cid;

    // 🔹 If sessionId exists, reuse it
    if (sessionId) {
      session = await ChatSession.findOne({ _id: sessionId, user: userId });
      if (!session) {
        return res.status(404).json({ success: false, message: "Session not found" });
      }
      cid = session.cid;
    } else {
      // 🔹 Otherwise create new session via upsert-chapter
      const upsertRes = await axios.get(
        "https://InsaneJSK-Code4Bharat-API.hf.space/upsert-chapter",
        { params: { class_num, subject, chapter } }
      );
      cid = upsertRes.data?.cid;
      if (!cid) {
        return res.status(500).json({
          success: false,
          message: "Missing cid from upsert-chapter response",
        });
      }

      session = await ChatSession.create({
        user: userId,
        title: `Flashcard ${class_num} - ${subject}`,
        class_num,
        subject,
        chapter,
        cid,
      });
    }

    if (!cid || !count) {
      return res.status(400).json({ error: "cid and count are required" });
    }

    // 🔗 External API call
    const apiUrl = `http://InsaneJSK-Code4Bharat-API.hf.space/generate-flashcards?cid=${encodeURIComponent(
      cid
    )}&count=${count}`;

    const response = await axios.get(apiUrl);

    // API returns { flashcards: [ { Question, Answer } ] }
    const generatedCards = response.data.flashcards || [];
    if (!Array.isArray(generatedCards) || generatedCards.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No flashcards returned from API",
        flashcards: [],
      });
    }

    // 🔹 Normalize structure to match Flashcard schema
    const flashcardsToSave = generatedCards.map((card) => ({
      cid,
      question: card.Question || card.question || card.q,
      answer: Array.isArray(card.Answer)
        ? card.Answer.join(", ")
        : card.Answer || card.answer || card.a,
    }));

    // Save individual flashcards
    const savedCards = await Flashcard.insertMany(flashcardsToSave);

    // 🔹 Create a set that groups these cards
    const newSet = await SetFlash.create({
      uuid: uuidv4(),
      cards: savedCards.map((c) => c._id),
    });

    // Return populated set
    const populatedSet = await SetFlash.findById(newSet._id).populate("cards");
    res.json(populatedSet);
  } catch (error) {
    console.error("Flashcard generation error:", error.message);
    res.status(500).json({ error: "Failed to generate flashcards" });
  }
};
