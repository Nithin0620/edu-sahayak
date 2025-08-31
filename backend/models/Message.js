const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
    session: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "ChatSession", 
      required: true 
    },
    messages: [
      {
        role: { type: String, enum: ["user", "assistant"], required: true },
        content: { type: String, required: true },
      }
    ],
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
});

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
