const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();

router.post("/send-email", async (req, res) => {
  const { email, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // you’ll receive messages here
      replyTo: email,
      subject: `Support: ${subject}`,
      text: `From: ${email}\n\n${message}\n 🕓 Time: ${new Date().toLocaleString()}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Email send failed:", error);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
});

module.exports = router;
