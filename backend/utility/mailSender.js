const nodemailer = require("nodemailer")
require("dotenv").config();

exports.sendEmail = async(email,title,body)=>{
   try{
      const transporter = nodemailer.createTransport({
         host:process.env.MAIL_HOST,
         port: 465,
         secure: true,
         auth :{
            user: process.env.MAIL_USER,
            pass : process.env.MAIL_PASS
         }
      })

      const mailOptions = {
         from :"Nithin",
         to:`${email}`,
         subject : `${title}`,
         html:`<h1>${body}<h1/>`
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