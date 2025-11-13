const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/temp");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /\.(jpeg|jpg|png|gif|pdf|doc|docx|txt|zip|rar)$/i;
    const extname = allowedExtensions.test(
      path.extname(file.originalname).toLowerCase()
    );

    // Check extension first (more reliable)
    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images, PDFs, documents, and archives are allowed."));
    }
  },
});

// Helper function to get category display name
const getCategoryName = (category) => {
  const categories = {
    technical: "Technical Support",
    billing: "Billing & Payment",
    feature: "Feature Request",
    bug: "Bug Report",
    general: "General Inquiry",
    account: "Account Issues",
  };
  return categories[category] || category;
};

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File size too large. Maximum size is 10MB per file.",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        error: "Too many files. Maximum 5 files allowed.",
      });
    }
    return res.status(400).json({
      success: false,
      error: `Upload error: ${err.message}`,
    });
  }
  if (err) {
    return res.status(400).json({
      success: false,
      error: err.message || "File upload error",
    });
  }
  next();
};

router.post("/send-email", upload.array("attachments", 5), handleMulterError, async (req, res) => {
  const { email, category, subject, message } = req.body;
  const files = req.files || [];

  // Validate required fields
  if (!email || !category || !subject || !message) {
    // Clean up uploaded files if validation fails
    files.forEach((file) => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });
    return res
      .status(400)
      .json({ success: false, error: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Prepare attachments for the support email
    const attachments = files.map((file) => ({
      filename: file.originalname,
      path: file.path,
    }));

    // 1. Send support email to admin (your email)
    const supportMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // You'll receive messages here
      replyTo: email,
      subject: `[${getCategoryName(category)}] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6c63ff;">New Support Request</h2>
          <div style="background-color: #f5f5f5; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
            <p><strong>Category:</strong> ${getCategoryName(category)}</p>
            <p><strong>From:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <div style="background-color: #fff; padding: 1rem; border-left: 4px solid #6c63ff; margin: 1rem 0;">
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          ${files.length > 0 ? `<p><strong>Attachments:</strong> ${files.length} file(s)</p>` : ""}
        </div>
      `,
      text: `Category: ${getCategoryName(category)}\nFrom: ${email}\nSubject: ${subject}\nTime: ${new Date().toLocaleString()}\n\n${message}${files.length > 0 ? `\n\nAttachments: ${files.length} file(s)` : ""}`,
      attachments: attachments,
    };

    await transporter.sendMail(supportMailOptions);
    console.log("✅ Support email sent to admin");

    // 2. Send auto-acknowledgment email to user
    const acknowledgmentMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Re: ${subject} - We've received your request`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #6c63ff, #7b6cff); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Thank You for Contacting Us!</h1>
          </div>
          <div style="background-color: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Dear Valued Customer,
            </p>
            <p style="color: #555; font-size: 15px; line-height: 1.6;">
              We have successfully received your support request regarding <strong>"${subject}"</strong> 
              under the category <strong>${getCategoryName(category)}</strong>.
            </p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6c63ff;">
              <p style="margin: 0; color: #555; font-size: 14px;">
                <strong>Request Details:</strong><br/>
                Category: ${getCategoryName(category)}<br/>
                Subject: ${subject}<br/>
                Submitted: ${new Date().toLocaleString()}
              </p>
            </div>
            <p style="color: #555; font-size: 15px; line-height: 1.6;">
              Our support team will review your request and get back to you within <strong>24 hours</strong>. 
              We appreciate your patience and understanding.
            </p>
            <p style="color: #555; font-size: 15px; line-height: 1.6;">
              If you have any additional information or questions, please reply to this email.
            </p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              <p style="color: #888; font-size: 14px; margin: 0;">
                Best regards,<br/>
                <strong style="color: #6c63ff;">Athena AI Support Team</strong>
              </p>
            </div>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
            <p>This is an automated acknowledgment email. Please do not reply directly to this message.</p>
          </div>
        </div>
      `,
      text: `Thank You for Contacting Us!

Dear Valued Customer,

We have successfully received your support request regarding "${subject}" under the category ${getCategoryName(category)}.

Request Details:
Category: ${getCategoryName(category)}
Subject: ${subject}
Submitted: ${new Date().toLocaleString()}

Our support team will review your request and get back to you within 24 hours. We appreciate your patience and understanding.

If you have any additional information or questions, please reply to this email.

Best regards,
Athena AI Support Team

---
This is an automated acknowledgment email. Please do not reply directly to this message.`,
    };

    await transporter.sendMail(acknowledgmentMailOptions);
    console.log("✅ Acknowledgment email sent to user");

    // Clean up uploaded files after sending emails
    files.forEach((file) => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });

    res.status(200).json({
      success: true,
      message: "Email sent successfully! Acknowledgment email has been sent to your inbox.",
    });
  } catch (error) {
    console.error("❌ Email send failed:", error);

    // Clean up uploaded files on error
    files.forEach((file) => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });

    // Provide helpful error messages for common authentication issues
    let errorMessage = "Failed to send email. Please try again later.";
    
    if (error.message && error.message.includes("Invalid login")) {
      errorMessage = "Email authentication failed. Please check EMAIL_USER and EMAIL_PASS in .env file. For Gmail, you need to use an App Password (not your regular password). See EMAIL_SETUP.md for instructions.";
    } else if (error.message && error.message.includes("534-5.7.9")) {
      errorMessage = "Gmail authentication error. Please use an App Password instead of your regular password. See EMAIL_SETUP.md for setup instructions.";
    } else if (error.message) {
      errorMessage = `Email error: ${error.message}`;
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
});

module.exports = router;
