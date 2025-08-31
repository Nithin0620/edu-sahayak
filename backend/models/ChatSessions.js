const mongoose = require("mongoose");

const chatSessionSchema = new mongoose.Schema({
   user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
   },
   title: { 
      type: String, 
      default: "New Chat" 
   },
   class_num: { 
      type: Number, 
      required: true 
   },
   subject: { 
      type: String, 
      required: true 
   },
   chapter: { 
      type: String, 
      required: true 
   },
   createdAt: { 
      type: Date, 
      default: Date.now 
   },
   cid: {
      type: String,
      required: false,
   },
});

module.exports = mongoose.model("ChatSession", chatSessionSchema);
