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
   console.log(`[OTP Model] 📧 Sending verification email to: ${email} with OTP: ${otp}`);
   try{
      const mailResponse = await sendEmail(
         email,
         "Verification Email from EduSahayak",
         verificationMailTamplet(otp)
      );
      console.log(`[OTP Model] ✅ Verification email sent to: ${email}`);
      return mailResponse;
   }
   catch(error){
      console.error(`[OTP Model] ❌ Error sending verification email to: ${email}`, error);
      throw error;
   }
}



otpSchema.pre("save",async function(next){
   console.log(`[OTP Model] 🔄 pre-save hook triggered for: ${this.email}`);
   if(this.isNew){
      await sendVerificationEmail(this.email , this.otp)
   }
   next();
})


module.exports = mongoose.model("OTP",otpSchema);