const nodemailer = require("nodemailer");

// sendOtp fn for sending otp to user's mail


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Note App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`
    });

    console.log("Message sent:", info.messageId);
  } catch (err) {
    console.error("Error sending email:", err);
    throw new Error("Email could not be sent");
  }
};



module.exports = sendEmail