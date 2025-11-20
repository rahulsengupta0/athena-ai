import React from "react";
import Reveal from "./Reveal";
import MotionCard from "./MotionCard";
import "./ProjectsSection.css";

const ProjectsSection = () => {
  return (
    <section className="projects section" id="projects">
      <Reveal className="center">
        <div className="kicker">Projects</div>
        <h2 className="h2">Organize and track work</h2>
        <p className="muted">Keep designs, assets and templates in folders. Pin favorites and see activity.</p>
      </Reveal>

      <div className="projects-row">
        <Reveal>
        <MotionCard className="proj-card card">
          <div className="pc-title">Recent Projects</div>
          <div className="pc-list">
            <div className="pc-item">E-commerce Landing</div>
            <div className="pc-item">Brand Assets</div>
            <div className="pc-item">YouTube Intro</div>
          </div>
        </MotionCard>
        </Reveal>
        <Reveal delay={0.08}>
        <MotionCard className="proj-card card">
          <div className="pc-title">Stats</div>
          <div className="pc-stats">
            <div className="stat-box"><span>24</span><small>Projects</small></div>
            <div className="stat-box"><span>6</span><small>Favorites</small></div>
            <div className="stat-box"><span>12</span><small>Team</small></div>
          </div>
        </MotionCard>
        </Reveal>
      </div>
    </section>
  );
};

export default ProjectsSection;