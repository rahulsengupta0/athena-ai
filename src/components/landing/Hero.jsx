// src/components/landing/Hero.jsx
import React from "react";
import { motion } from "framer-motion";
import HeroBgGradient from "./HeroBgGradient";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero section reveal" id="hero">
      <HeroBgGradient />
      <div className="hero-inner">
        <div className="hero-left">
          <div className="kicker">Athena AI • Creative Suite</div>
          <motion.h1 className="hero-title" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
            What will you <span>create</span> today?
          </motion.h1>
          <motion.p className="hero-lead" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}>
            Design, write, generate code, and create videos — all powered by AI.
            Build solo or collaborate with your team. Fast, flexible, and beautiful.
          </motion.p>

          <motion.div className="hero-ctas" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}>
            <a className="btn btn-cta" href="/login">Start Creating</a>
            <a className="btn btn-ghost" href="/login">Explore Tools</a>
          </motion.div>

          <div className="hero-features">
            <div className="hf-item">AI Design Generator</div>
            <div className="hf-sep" />
            <div className="hf-item">Image & Video Editor</div>
            <div className="hf-sep" />
            <div className="hf-item">Team Collaboration</div>
          </div>
        </div>

        <div className="hero-right">
          <motion.div className="mockup-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}>
            <div className="mockup-topbar">
              <div className="dot red" />
              <div className="dot yellow" />
              <div className="dot green" />
            </div>

            <div className="mockup-canvas">
              <div className="mockup-leftpanel">
                <div className="mp-item">Templates</div>
                <div className="mp-item">Projects</div>
                <div className="mp-item active">Designs</div>
                <div className="mp-item">Assets</div>
              </div>

              <div className="mockup-main">
                <div className="mockup-stage">
                  <div className="widget code">
                    <div className="w-title">AI Code</div>
                    <pre>{`<Button variant="primary">Create</Button>`}</pre>
                  </div>

                  <div className="widget image">
                    <div className="w-title">Image Editor</div>
                    <div className="img-sample" />
                  </div>

                  <div className="widget chat">
                    <div className="w-title">AI Assist</div>
                    <div className="chat-line">Describe your idea and Athena will help — try “instagram post”</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mockup-floating">
              <div className="tag">New • Templates</div>
              <div className="icons-inline">
                <div className="ico-small">🎨</div>
                <div className="ico-small">✍️</div>
                <div className="ico-small">💻</div>
                <div className="ico-small">🎬</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
