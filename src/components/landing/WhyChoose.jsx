import React from "react";
import Reveal from "./Reveal";
import MotionCard from "./MotionCard";
import "./WhyChoose.css";

const WhyChoose = () => {
  return (
    <section className="why section">
      <div className="why-grid">
        
        <Reveal className="why-left">
          <div className="kicker">Power & collaboration</div>
          <h2 className="h2">Why Choose Athena?</h2>
          <p className="muted">AI-first tools + team features. Fast prototyping, seamless handoffs and analytics to track what matters.</p>

          <ul className="why-list">
            <li>
              <strong>All-in-one:</strong> Design, write, code and create video in the same place.
            </li>
            <li>
              <strong>Team-ready:</strong> Share projects, comments and real-time collaboration.
            </li>
            <li>
              <strong>Analytics:</strong> See what designs perform and which templates your team uses.
            </li>
          </ul>
        </Reveal>

        <Reveal>
          <MotionCard className="why-right card why-glow">
          <div className="stats-row">
            <div className="stat stat-glow">
              <div className="stat-num">1.2k+</div>
              <div className="stat-label">Projects created</div>
            </div>

            <div className="stat stat-glow">
              <div className="stat-num">6×</div>
              <div className="stat-label">Faster workflows</div>
            </div>

            <div className="stat stat-glow">
              <div className="stat-num">Team</div>
              <div className="stat-label">Real-time collaboration</div>
            </div>
          </div>

          <div className="chart-sample smooth-shadow" aria-hidden />
          </MotionCard>
        </Reveal>
      </div>
    </section>
  );
};

export default WhyChoose;
