const mongoose = require("mongoose");

const setsFlash = new mongoose.Schema({
  uuid: {
      type: String,
      unique: true,
   },
   cards: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Flashcard", required: true },
   ],
});

module.exports = mongoose.model("SetFlash", setsFlash);
