// module.exports = sendEmail;
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      // service: "gmail",
       host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();

    console.log("Sending email to:", to);
    console.log("EMAIL_USER:", process.env.EMAIL_USER);

    const info = await transporter.sendMail({
      from: `"Grievance System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html, 
    });

    console.log("Email sent:", info.messageId);

  } catch (error) {
    console.log("Email full error:", error);
  }
};

module.exports = sendEmail;

// const sgMail = require("@sendgrid/mail");

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const sendEmail = async (to, subject, html) => {
//   try {
//     const msg = {
//       to,
//       from: process.env.EMAIL_FROM,
//       subject,
//       html,
//     };

//     const response = await sgMail.send(msg);

//     console.log("Email sent:", response[0].statusCode);

//   } catch (error) {
//     console.log("SendGrid error:", error.response?.body || error.message);
//   }
// };

// module.exports = sendEmail;