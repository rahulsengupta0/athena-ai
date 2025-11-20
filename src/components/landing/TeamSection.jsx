import React from "react";
import "./TeamSection.css";

const TeamSection = () => {
  return (
    <section className="team section" id="team">
      <div className="center">
        <div className="kicker">Team</div>
        <h2 className="h2">Collaborate in real time</h2>
        <p className="muted">Invite teammates, share comments, and co-create designs together.</p>
      </div>

      <div className="team-row">
        <div className="team-card card">
          <div className="tc-title">Members</div>
          <div className="tc-list">
            <div className="tc-item">Designer • Maya</div>
            <div className="tc-item">Content • Rohit</div>
            <div className="tc-item">Engineer • Alex</div>
          </div>
        </div>
        <div className="team-card card">
          <div className="tc-title">Sharing</div>
          <div className="tc-desc">Invite by email, manage permissions and roles.</div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;