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
      const mailresponse = await sendEmail(
         email,
         "verification Email",
         verificationMailTamplet(otp)
      )
   }
   catch(e){
      console.log("error in calling the mailSender function inside the otp.js modal")
      console.log(e);
   }
}



otpSchema.pre("save",async function(next){
   if(this.isNew){
      await sendVerificationEmail(this.email , this.otp)
   }
   next();
})


module.exports = mongoose.model("OTP",otpSchema);