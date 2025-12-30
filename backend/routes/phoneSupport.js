const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const nodemailer = require("nodemailer");

// ============================
// INLINE AUTH MIDDLEWARE
// ============================
const auth = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};


// ============================
// NODEMAILER SETUP
// ============================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ============================
// POST /schedule-call
// ============================
router.post("/schedule-call", auth, async (req, res) => {
  const { date, time, phonePreference } = req.body;

  if (!date || !time) {
    return res.status(400).json({ msg: "Date and time are required" });
  }

  try {
    // Fetch logged-in user's details
    const user = await User.findById(req.user.id).select(
      "email firstName lastName phone"
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const fullName = `${user.firstName} ${user.lastName}`;

    // ======================================================
    // 1️⃣ SEND EMAIL TO ADMIN 
    // ======================================================
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `📞 New Call Scheduling Request from ${fullName}`,
      html: `
        <h2>New Call Request</h2>
        <p><b>Name:</b> ${fullName}</p>
        <p><b>Email:</b> ${user.email}</p>
        <p><b>Phone:</b> ${user.phone || "Not provided"}</p>
        <p><b>Preferred Date:</b> ${date}</p>
        <p><b>Preferred Time:</b> ${time}</p>
        <p><b>Preference:</b> ${phonePreference || "Not specified"}</p>
      `,
    };

    await transporter.sendMail(adminMailOptions);

    // ======================================================
    // 2️⃣ SEND ACKNOWLEDGMENT EMAIL TO USER
    // ======================================================
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "📞 Call Request Received – We’ll Reach Out Soon",
      html: `
        <h2>Hello, ${fullName}!</h2>
        <p>Your call request has been received successfully.</p>
        <p><b>Date Selected:</b> ${date}</p>
        <p><b>Time Slot:</b> ${time}</p>
        <p>We will reach out to you within your selected time window.</p>
        <br/>
        <p>For urgent queries, simply reply to this email.</p>
        <br/>
        <p>— Support Team</p>
      `,
    };

    await transporter.sendMail(userMailOptions);

    // ======================================================
    // FINAL API RESPONSE
    // ======================================================
    res.json({
      success: true,
      msg: "Call scheduled & emails sent successfully",
      email: user.email,
      date,
      time,
    });
  } catch (err) {
    console.error("❌ Schedule Call Error:", err);
    res.status(500).send("Server error");
  }
});

module.exports = {
  router,
  auth
};





