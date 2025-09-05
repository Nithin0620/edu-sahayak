const mongoose = require("mongoose")

const profileSchema = new mongoose.Schema({
   user: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "User",
   required: true,
   unique: true,
   },


   class: {
      type: String, 
      required: true,
   },

   schoolOrCollege: {
      type: String,
      required: true,
      trim: true,
   },

   board: {
      type: String,
      default: "",
   },

   interests: {
      type: [String], 
      default: [],
   },

   bio: {
      type: String,
      maxlength: 300,
      default: "",
   },

   location: {
      type: String,
      default: "",
   },

   socialLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
   },

   onboard: {
      eq_score: {
         type: Number,
         min: 5,
         max: 25,
         default: null,
      },
      eq_level: {
         type: String,
         default: null,
      },
      learning_style: {
         processing: {
            type: String,
            default: null,
         },
         perception: {
            type: String,
            default: null,
         },
         input: {
            type: String,
            default: null,
         },
         understanding: {
            type: String,
            default: null,
         },
      },
   },

   createdAt: {
      type: Date,
      default: Date.now,
   },
});

module.exports = mongoose.model("Profile", profileSchema);

