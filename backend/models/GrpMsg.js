// models/Message.js
const mongoose = require("mongoose");

const GRPmessageSchema = new mongoose.Schema(
  {
   class:{type:Number,required:true},
    group: { type:String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    content: { type: String, required: true },
    type: { type: String, enum: ["text", "image", "file"], default: "text" }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("GRPMessage", GRPmessageSchema);
