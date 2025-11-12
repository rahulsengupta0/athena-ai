import React, { useState } from "react";
import "./EmailSupport.css";

const EmailSupport = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSendEmail = async () => {
    if (!email || !subject || !message) {
      setStatus("⚠️ Please fill all fields");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("http://localhost:5000/api/email/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subject, message }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("✅ Email sent successfully!");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setStatus("❌ Failed to send email. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setStatus("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="email-support-modal">
      <div className="email-modal-header">
        <h3>Email Support</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <p className="email-modal-subtext">
        Send us a detailed message and we’ll get back to you within 24 hours.
      </p>

      <div className="form-grid">
        <input
          className="form-input"
          placeholder="Your email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="form-input"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <textarea
          className="form-textarea"
          placeholder="Describe your issue..."
          rows="6"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {status && <p className="status-text">{status}</p>}

      <button
        className="primary-btn"
        onClick={handleSendEmail}
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Email"}
      </button>
    </div>
  );
};

export default EmailSupport;
