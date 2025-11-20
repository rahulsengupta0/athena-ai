import React from "react";
import "./AnalyticsSection.css";

const AnalyticsSection = () => {
  return (
    <section className="analytics section" id="analytics">
      <div className="center">
        <div className="kicker">Analytics</div>
        <h2 className="h2">Understand performance</h2>
        <p className="muted">See which designs work best, track usage and activity across your workspace.</p>
      </div>

      <div className="analytics-row">
        <div className="an-card card">
          <div className="an-title">Breakdown</div>
          <div className="an-bars">
            {[
              { label: "Design", percent: 42 },
              { label: "Content", percent: 26 },
              { label: "Code", percent: 18 },
              { label: "Video", percent: 14 },
            ].map((b)=> (
              <div key={b.label} className="an-bar">
                <div className="an-bar-head">
                  <span>{b.label}</span>
                  <span>{b.percent}%</span>
                </div>
                <div className="an-bar-bg">
                  <div className="an-bar-fill" style={{ width: `${b.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="an-card card">
          <div className="an-title">Activity</div>
          <div className="an-list">
            {["Generated design template","Enhanced product photos","Created video intro"].map((t,i)=> (
              <div key={i} className="an-item">{t}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsSection;