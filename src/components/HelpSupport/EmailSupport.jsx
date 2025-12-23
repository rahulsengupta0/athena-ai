import React, { useState } from "react";
import "./EmailSupport.css";

const EmailSupport = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const categories = [
    { value: "", label: "Select a category" },
    { value: "technical", label: "Technical Support" },
    { value: "billing", label: "Billing & Payment" },
    { value: "feature", label: "Feature Request" },
    { value: "bug", label: "Bug Report" },
    { value: "general", label: "General Inquiry" },
    { value: "account", label: "Account Issues" },
  ];

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const handleSendEmail = async () => {
    if (!email || !category || !subject || !message) {
      setStatus("⚠️ Please fill all required fields");
      return;
    }

    // Validate file sizes (max 10MB per file)
    const maxSize = 10 * 1024 * 1024; // 10MB
    for (const file of files) {
      if (file.size > maxSize) {
        setStatus(`⚠️ File "${file.name}" exceeds 10MB limit`);
        return;
      }
    }

    setLoading(true);
    setStatus("");

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("category", category);
      formData.append("subject", subject);
      formData.append("message", message);

      files.forEach((file, index) => {
        formData.append(`attachments`, file);
      });

      const res = await fetch("http://localhost:5000/api/email/send-email", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setStatus("✅ Email sent successfully! You will receive an acknowledgment email shortly.");
        setEmail("");
        setCategory("");
        setSubject("");
        setMessage("");
        setFiles([]);
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
      } else {
        setStatus(`❌ ${data.error || "Failed to send email. Please try again."}`);
      }
    } catch (error) {
      console.error(error);
      setStatus("❌ Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-body">
      <div className="email-modal-header">
        <h3>Email Support</h3>
      </div>

      <p className="email-modal-subtext">
        Send us a detailed message and we’ll get back to you within 24 hours.
      </p>

      <div className="form-grid">
        <input
          className="form-input"
          placeholder="Your email *"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <select
          className="form-input form-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        <input
          className="form-input"
          placeholder="Subject *"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <textarea
          className="form-textarea"
          placeholder="Describe your issue... *"
          rows="6"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <div className="file-upload-container">
          <label htmlFor="file-upload" className="file-upload-label">
            <span className="file-upload-icon">📎</span>
            <span>Attach Files (Optional)</span>
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileChange}
              className="file-upload-input"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
            />
          </label>
          {files.length > 0 && (
            <div className="file-list">
              {files.map((file, index) => (
                <div key={index} className="file-item">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">({formatFileSize(file.size)})</span>
                  <button
                    type="button"
                    className="file-remove-btn"
                    onClick={() => removeFile(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="file-hint">Max 10MB per file. Supported: PDF, DOC, images, ZIP</p>
        </div>
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
