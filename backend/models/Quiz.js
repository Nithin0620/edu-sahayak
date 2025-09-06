const { json } = require("express");
const mongoose =require( "mongoose");

const quizSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: "ChatSession", required: true },
    cid: { type: String, required: true },
    title: { type: String, default: "Quiz" },
    subject: { type: String },
    difficulty: { type: String, default: "Medium" },
    quiz: [
      {
        question: String,
        options: [String],
        answer: [String],
      },
    ],

    completed:{
      type:Boolean,
      default:false,
    },

    ans:{
      type:Number,
    },

    score: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
