// CTA.jsx
import React from "react";
import "./CTA.css";

const CTA = () => (
  <section className="cta section">
    <div className="cta-inner card">
      <div className="cta-left">
        <div className="kicker">Join Athena</div>
        <h2 className="h2">Ready to build something amazing?</h2>
        <p className="muted">Start a free project and explore AI-powered creative tools.</p>
      </div>
      <div className="cta-right">
        <button className="btn btn-cta">Get Started — It's free</button>
        <button className="btn btn-ghost">See Pricing</button>
      </div>
    </div>
  </section>
);

export default CTA;
