import React, { useState } from "react";
import { createPortal } from "react-dom";
import "./PhoneSupport.css";

const PhoneSupport = ({ onClose }) => {
  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleCallNow = () => {
    window.location.href = "tel:+18005550199";
  };

  const handleScheduleClick = () => {
    setOpenScheduleModal(true);
  };

  const handleCloseSchedule = () => {
    setOpenScheduleModal(false);
    setPreferredDate("");
    setPreferredTime("");
    setError("");
    setIsSubmitted(false);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!preferredDate) {
      setError("Please select a preferred date");
      return;
    }

    if (!preferredTime) {
      setError("Please select a preferred time");
      return;
    }

    // Check if date is in the past
    const selectedDate = new Date(preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setError("Please select a future date");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Add API call here when backend is ready
      // const response = await fetch("http://localhost:5000/api/phone/schedule-call", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ date: preferredDate, time: preferredTime }),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSubmitted(true);
      
      // Reset form after showing confirmation
      setTimeout(() => {
        handleCloseSchedule();
      }, 3000);
    } catch (err) {
      setError("Failed to schedule call. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <>
      <div className="modal-body">
        <h3>Phone Support</h3>
        <p>Call us at <strong>+1 (800) 555-0199</strong> Mon–Fri, 9am–6pm (UTC).</p>
        <div className="contact-actions">
          <button className="primary-btn" onClick={handleCallNow}>
            Call Now
          </button>
          <button className="secondary-btn" onClick={handleScheduleClick}>
            Schedule a Call
          </button>
        </div>
      </div>

      {/* Schedule Call Modal - Rendered via Portal */}
      {openScheduleModal && createPortal(
        <div className="schedule-modal-overlay" onClick={handleCloseSchedule}>
          <div className="schedule-modal" onClick={(e) => e.stopPropagation()}>
            <div className="schedule-modal-header">
              <h3>Schedule a Call</h3>
              <button className="schedule-modal-close" onClick={handleCloseSchedule} aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="schedule-modal-body">
              {isSubmitted ? (
                <div className="schedule-success">
                  <div className="success-icon">✓</div>
                  <h4>Call Scheduled Successfully!</h4>
                  <p>We'll call you on <strong>{new Date(preferredDate).toLocaleDateString()}</strong> at <strong>{preferredTime}</strong></p>
                  <p className="success-note">You'll receive a confirmation email shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleScheduleSubmit}>
                  <p className="schedule-subtext">
                    Select your preferred date and time for a callback from our support team.
                  </p>

                  {/* Preferred Date Button Cards */}
                  <div className="form-group">
                    <label>Preferred Date *</label>
                    <div className="date-card-container">
                      {Array.from({ length: 7 }).map((_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() + i);

                        const dateValue = date.toISOString().split("T")[0];
                        const label =
                          i === 0
                            ? "Today"
                            : i === 1
                            ? "Tomorrow"
                            : date.toLocaleDateString(undefined, {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                              });

                        return (
                          <button
                            type="button"
                            key={i}
                            className={`date-card ${preferredDate === dateValue ? "selected" : ""}`}
                            onClick={() => setPreferredDate(dateValue)}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Preferred Time Button Cards */}
                  <div className="form-group">
                    <label>Preferred Time *</label>
                    <div className="time-card-container">
                      {["10am – 12pm", "12pm – 2pm", "2pm – 4pm", "4pm – 6pm"].map((slot) => (
                        <button
                          type="button"
                          key={slot}
                          className={`time-card ${preferredTime === slot ? "selected" : ""}`}
                          onClick={() => setPreferredTime(slot)}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>


                  {error && <div className="error-message">{error}</div>}

                  <div className="schedule-modal-actions">
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={handleCloseSchedule}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="schedule-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Scheduling..." : "Schedule Call"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default PhoneSupport;

