const { json } = require("express");
const mongoose =require( "mongoose");

const quizSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: "ChatSession", required: true },
    cid: { type: String, required: true },
    quiz: [
      {
        question: String,
        options: [String],
        answer: [String],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
