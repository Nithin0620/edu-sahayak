const mongoose = require("mongoose")
const {verificationMailTamplet} = require('../tamplets/emailVerificationTamplet.js')
const {sendEmail} = require("../utility/mailSender.js")

const otpSchema = new mongoose.Schema({
   email:{
      type:String,
      required:true
   },
   otp:{
      type:String,
      required:true,
   },
   createdAt : {
      type:Date,
      default:Date.now,
      expires:10*60,
   }
})


const sendVerificationEmail = async(email,otp) =>{
   try{
      const mailResponse = await sendEmail(
         email,
         "Verification Email from EduSahayak",
         verificationMailTamplet(otp)
      );
      console.log("Mail sent successfully:", mailResponse);
      return mailResponse;
   }
   catch(error){
      console.error("Error sending verification email:", error);
      throw error; // Throw error to be handled by controller
   }
}



otpSchema.pre("save",async function(next){
   if(this.isNew){
      await sendVerificationEmail(this.email , this.otp)
   }
   next();
})


module.exports = mongoose.model("OTP",otpSchema);