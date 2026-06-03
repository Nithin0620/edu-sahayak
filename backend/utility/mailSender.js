const nodemailer = require("nodemailer")
require("dotenv").config();

exports.sendEmail = async(email,title,body)=>{
   console.log(`[mailSender] 📋 Mail config:`, {
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false,
      user: process.env.MAIL_USER,
      from: process.env.MAIL_FROM || "nithin30302@gmail.com",
      to: email,
      subject: title
   });
   try{
      const transporter = nodemailer.createTransport({
         host:process.env.MAIL_HOST,
         port: 587,
         secure: false,
         auth :{
            user: process.env.MAIL_USER,
            pass : process.env.MAIL_PASS
         }
      })

      const mailOptions = {
         from :`"EduSahayak" <${process.env.MAIL_FROM || "nithin30302@gmail.com"}>`,
         to:`${email}`,
         subject : `${title}`,
         html: body
      }

      console.log(`[mailSender] 📧 Sending email to: ${email}`);
      const response = await transporter.sendMail(mailOptions);
      console.log(`[mailSender] ✅ Email sent to: ${email}`);
      return response ;
   }
   catch(e){
      console.log("Error occured in sending the mail in mailsender utility folder");
      throw e;
   }
}