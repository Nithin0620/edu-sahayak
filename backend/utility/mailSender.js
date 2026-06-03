// ─────────────────────────────────────────────────────────────
// OLD: Nodemailer / SMTP implementation (kept for reference)
// ─────────────────────────────────────────────────────────────
// const nodemailer = require("nodemailer")
//
// exports.sendEmail = async(email,title,body)=>{
//    console.log(`[mailSender] Mail config:`, {
//       host: process.env.MAIL_HOST,
//       port: 587,
//       secure: false,
//       user: process.env.MAIL_USER,
//       from: process.env.MAIL_FROM || "nithin30302@gmail.com",
//       to: email,
//       subject: title
//    });
//    try{
//       const transporter = nodemailer.createTransport({
//          host:process.env.MAIL_HOST,
//          port: 587,
//          secure: false,
//          auth :{
//             user: process.env.MAIL_USER,
//             pass : process.env.MAIL_PASS
//          }
//       })
//
//       const mailOptions = {
//          from :`"EduSahayak" <${process.env.MAIL_FROM || "nithin30302@gmail.com"}>`,
//          to:`${email}`,
//          subject : `${title}`,
//          html: body
//       }
//
//       console.log(`[mailSender] Sending email to: ${email}`);
//       const response = await transporter.sendMail(mailOptions);
//       console.log(`[mailSender] Email sent to: ${email}`);
//       return response ;
//    }
//    catch(e){
//       console.log("Error occured in sending the mail in mailsender utility folder");
//       throw e;
//    }
// }

// ─────────────────────────────────────────────────────────────
// Brevo Transactional Email API  (official SDK)
// ─────────────────────────────────────────────────────────────
const { BrevoClient, BrevoError } = require('@getbrevo/brevo');
require('dotenv').config();

const MAX_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 1000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const client = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });

exports.sendEmail = async (email, subject, htmlBody) => {
  console.log(`[mailSender] Starting email request:`, {
    to: email,
    subject,
    senderName: process.env.BREVO_SENDER_NAME || 'EduSahayak',
    senderEmail: process.env.BREVO_SENDER_EMAIL,
  });

  const payload = {
    sender: {
      name: process.env.BREVO_SENDER_NAME || 'EduSahayak',
      email: process.env.BREVO_SENDER_EMAIL,
    },
    to: [{ email }],
    subject,
    htmlContent: htmlBody,
  };

  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[mailSender] Sending email to: ${email} (attempt ${attempt}/${MAX_RETRIES})`);
      const response = await client.transactionalEmails.sendTransacEmail(payload);
      const messageId = response.messageId;
      console.log(`[mailSender] Email sent successfully to: ${email}`, { messageId, attempt });
      return response;
    } catch (error) {
      lastError = error;
      const statusCode = error instanceof BrevoError ? error.statusCode : null;
      const errorBody = error instanceof BrevoError ? error.body : error.message;

      console.error(`[mailSender] Attempt ${attempt}/${MAX_RETRIES} failed for: ${email}`, {
        statusCode,
        error: errorBody,
      });

      if (statusCode && statusCode >= 400 && statusCode < 500) {
        console.error(`[mailSender] Non-retryable client error (${statusCode}), aborting.`);
        break;
      }

      if (attempt < MAX_RETRIES) {
        const delay = BASE_RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        console.log(`[mailSender] Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  console.error(`[mailSender] All ${MAX_RETRIES} attempts failed for: ${email}`);
  throw lastError;
};
