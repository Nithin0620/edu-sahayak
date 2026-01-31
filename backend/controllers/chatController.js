const ChatSession = require('../models/ChatSessions');
const ChatMessage = require('../models/Message');
const axios = require('axios');
const User = require('../models/User');


exports.chatWithAI = async (req, res) => {
  try {
    const { user_input, sessionId, class_num, subject, chapter } = req.body;
    const userId = req.user.userId;

    // 🔍 Validate required inputs
    if (!user_input || !class_num || !subject || !chapter) {
      return res.status(400).json({
        success: false,
        message: "Required fields: user_input, class_num, subject, chapter",
      });
    }

    let session;
    let cid;
    let messages = [];
    let isNewSession = false;

    console.log('hello')
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Case 1: Existing Session
    console.log('hello2')
    if (sessionId) {
      session = await ChatSession.findOne({ _id: sessionId, user: userId });

      if (!session) {
        return res.status(404).json({
          success: false,
          message: "Session not found",
        });
      }

      cid = session.cid;
      console.log(session)
      console.log("in the old one ", cid)
      const previousMessages = await ChatMessage.find({ session: sessionId }).sort({ createdAt: 1 });
      previousMessages.forEach(doc => messages.push(...doc.messages));

    } else {
      // ✅ Case 2: New Session
      console.log('Calling upsert-chapter with:', { class_num, subject, chapter });
      const upsertRes = await axios.get(
        'https://InsaneJSK-Code4Bharat-API.hf.space/upsert-chapter',
        {
          params: { class_num, subject, chapter }
        }
      );
      console.log('upserRes:', upsertRes.data)

      cid = upsertRes.data?.cid;
      if (!cid) {
        return res.status(500).json({
          success: false,
          message: "Missing cid from upsert-chapter response",
        });
      }

      session = await ChatSession.create({
        user: userId,
        title: user_input.substring(0, 30),
        class_num,
        subject,
        chapter,
        cid, // ✅ Save cid in DB
      });
      console.log("new Upsert ,", cid)

      isNewSession = true;
    }

    // ➕ Add user input
    messages.push({ role: "user", content: user_input });

    // 🧠 Prepare and send payload to chat-ncert
    const payload = {
      cid: cid, // ✅ Always use cid from DB (whether existing or just saved)
      messages,
      user_input,
      // class_num,
      // subject,
      // chapter,

      profile: user.onboard,

    };
    //  console.log("📦 Payload being sent to chat-ncert:", payload);

    const response = await axios.post(
      "https://InsaneJSK-Code4Bharat-API.hf.space/chat-ncert",
      payload
    );

    const assistantReply = response.data?.response || "No response from AI.";
    messages.push({ role: "assistant", content: assistantReply });

    // 💾 Save user & assistant messages to DB
    await ChatMessage.create({
      session: session._id,
      messages: [
        { role: "user", content: user_input },
        { role: "assistant", content: assistantReply },
      ],
    });

    // 📝 If it’s a new session, generate a title from AI
    if (isNewSession) {
      try {
        const titleRes = await axios.get(
          "https://InsaneJSK-Code4Bharat-API.hf.space/chat-title",
          {
            params: {
              user_input,
              llm_response: assistantReply,
            },
          }
        );

        const updatedTitle = titleRes.data?.title;
        if (updatedTitle) {
          await ChatSession.findByIdAndUpdate(session._id, { title: updatedTitle });
        }
      } catch (err) {
        console.error("Failed to update session title:", err.message);
      }
    }

    return res.status(200).json({
      success: true,
      reply: assistantReply,
      messages,
      sessionId: session._id,
    });

  } catch (err) {
    console.error("Chat error:", err?.response?.data || err.message);
    console.error("Full error:", err);
    return res.status(500).json({
      success: false,
      message: "Chat failed",
      error: err?.response?.data || err.message,
    });
  }
};




exports.getUserSessions = async (req, res) => {
  const { userId } = req.user;

  try {
    const sessions = await ChatSession.find({ user: userId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: sessions });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch sessions' });
  }
};

exports.getMessagesBySession = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const chatDocs = await ChatMessage.find({ session: sessionId }).sort({ createdAt: 1 });

    const allMessages = chatDocs.reduce((acc, doc) => {
      return acc.concat(doc.messages);
    }, []);

    return res.status(200).json({ success: true, messages: allMessages });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
};
