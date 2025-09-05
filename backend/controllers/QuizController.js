const axios = require("axios");
const Quiz = require("../models/Quiz.js");
const ChatSession = require("../models/ChatSessions.js");


exports.generateQuiz = async (req, res) => {
  try {
    const { sessionId, class_num, subject, chapter } = req.body;
    const userId = req.user.userId;

    console.log("📥 Incoming Data:", sessionId, class_num, subject, chapter);
    
    let SessionID;
    let session;
    let cid;
    let isNewSession = false;

    if (sessionId) {
      session = await ChatSession.findOne({ _id: sessionId, user: userId });
      if (!session) {
        return res.status(404).json({ success: false, message: "Session not found" });
      }
      cid = session.cid;
      SessionID = sessionId;
      console.log("✅ Using existing session CID:", cid);
    } else {
      if (!class_num || !subject || !chapter) {
        return res.status(400).json({
          success: false,
          message: "Required fields: class_num, subject, chapter",
        });
      }

      // 🔗 Call upsert-chapter
      const upsertRes = await axios.get(
        "https://InsaneJSK-Code4Bharat-API.hf.space/upsert-chapter",
        { params: { class_num, subject, chapter } }
      );

      console.log("📦 Upsert Response:", upsertRes.data);

      cid = upsertRes.data?.cid || upsertRes.data?.data?.cid; // 🔑 safer extraction
      if (!cid) {
        return res.status(500).json({
          success: false,
          message: "Missing cid from upsert-chapter response",
          rawResponse: upsertRes.data,
        });
      }

      // 💾 Create a new ChatSession
      session = await ChatSession.create({
        user: userId,
        title: `Quiz - ${subject} | ${chapter}`,
        class_num,
        subject,
        chapter,
        cid,
      });
      sessionId = session._id;

      isNewSession = true;
      console.log("🆕 Created new session with CID:", cid);
    }

    // 🔗 Call generate-quiz
    const apiRes = await axios.get(
      "https://InsaneJSK-Code4Bharat-API.hf.space/generate-quiz",
      { params: { cid } }
    );

    console.log("📦 Quiz API Response:", apiRes.data);

    const quizData = apiRes.data?.quiz || [];
    if (!quizData.length) {
      return res.status(200).json({
        success: true,
        quiz: [],
        sessionId: session._id,
        cid,
        message: "No quiz returned from API",
      });
    }

    // 💾 Save or update quiz
    let savedQuiz = await Quiz.findOneAndUpdate(
      { user: userId, session: session._id, cid },
      { quiz: quizData },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      quiz: savedQuiz.quiz,
      sessionId: sessionId,
      cid,
      isNewSession,
    });
  } catch (err) {
    console.error("❌ Quiz error:", err?.response?.data || err.message);
    return res.status(500).json({
      success: false,
      message: "Quiz generation failed",
      error: err?.response?.data || err.message,
    });
  }
};


exports.getAllQuizzes = async (req, res) => {
  try {
    const userId = req.user.userId; // from auth middleware

    // Fetch quizzes for this user + session
    const quizzes = await Quiz.find({ user: userId });

    if (!quizzes || quizzes.length === 0) {
      return res.status(200).json({
        success: true,
        quizzes: [],
        message: "No quizzes found for this session",
      });
    }

    res.status(200).json({
      success: true,
      quizzes,

    });
  } catch (err) {
    console.error("Error fetching quizzes:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching quizzes",
    });
  }
};
