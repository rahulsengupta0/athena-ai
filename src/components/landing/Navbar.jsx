// src/components/landing/Navbar.jsx
import React, { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav-root">
      <div className="nav-inner">
        <div className="nav-left">
          <a href="/" className="brand">
            <div className="brand-mark">A</div>
            <div className="brand-text">
              <strong>Athena</strong>
              <span className="brand-sub">AI</span>
            </div>
          </a>
        </div>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          <a href="/#features" className="nav-link">Features</a>
          <a href="/create" className="nav-link">Create</a>
          <a href="/projects" className="nav-link">Projects</a>
          <a href="/favorites" className="nav-link">Favorites</a>
          <a href="/team" className="nav-link">Team</a>
          <a href="/analytics" className="nav-link">Analytics</a>
        </nav>

        <div className="nav-actions">
          <a className="btn btn-ghost nav-btn" href="/login">Log in</a>
          <a className="btn btn-cta nav-btn" href="/login">Get Started</a>

          <button
            className={`hamburger ${open ? "is-active" : ""}`}
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
