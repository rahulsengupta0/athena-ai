import React from "react";
import Reveal from "./Reveal";
import MotionCard from "./MotionCard";
import "./CreateSection.css";

const CreateSection = () => {
  return (
    <section className="create section" id="create">
      <Reveal className="center">
        <div className="kicker">Create</div>
        <h2 className="h2">Start a new creation</h2>
        <p className="muted">Designs, images, content, code and videos — begin with templates or a blank canvas.</p>
      </Reveal>

      <div className="create-grid">
        <Reveal>
        <MotionCard className="create-card card">
          <div className="cc-ico">🎨</div>
          <div className="cc-title">Design Generator</div>
          <div className="cc-desc">Generate posters, logos and social graphics from prompts.</div>
        </MotionCard>
        </Reveal>
        <Reveal delay={0.06}>
        <MotionCard className="create-card card">
          <div className="cc-ico">🖼️</div>
          <div className="cc-title">Image Creator</div>
          <div className="cc-desc">Create product mockups or stylized art instantly.</div>
        </MotionCard>
        </Reveal>
        <Reveal delay={0.12}>
        <MotionCard className="create-card card">
          <div className="cc-ico">✍️</div>
          <div className="cc-title">Content Writer</div>
          <div className="cc-desc">Draft blogs, captions and emails with AI assistance.</div>
        </MotionCard>
        </Reveal>
        <Reveal delay={0.18}>
        <MotionCard className="create-card card">
          <div className="cc-ico">💻</div>
          <div className="cc-title">Code Generator</div>
          <div className="cc-desc">Scaffold components or backend snippets from prompts.</div>
        </MotionCard>
        </Reveal>
      </div>
    </section>
  );
};

export default CreateSection;