import React from "react";
import "./Showcase.css";

const Showcase = () => {
  return (
    <section className="showcase section">
      <div className="center">
        <div className="kicker">Product</div>
        <h2 className="h2">Real previews — created with Athena</h2>
        <p className="muted">Live examples of the editor, AI chat and produced assets — quick previews to showcase capabilities.</p>
      </div>

      <div className="showcase-row">
        <div className="showcase-left card">
          <div className="sc-header">Canva-like canvas</div>
          <div className="sc-img placeholder" />
        </div>

        <div className="showcase-right">
          <div className="sc-small card">
            <div className="sc-mini-title">AI Chat</div>
            <div className="sc-chat">“Generate an Instagram carousel about study tips.”</div>
          </div>

          <div className="sc-small card">
            <div className="sc-mini-title">Code Snippet</div>
            <pre className="sc-code">{`function createPost(){ /* code */ }`}</pre>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Showcase;
