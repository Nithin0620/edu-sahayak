// models/Group.js
const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },        // e.g., "Mathematics"
    subject: { type: String },                 // optional, e.g., "MATH101"
    class: { type: Number, required: true },      // class number

    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);
