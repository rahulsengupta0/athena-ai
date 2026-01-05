import React from "react";
import Reveal from "./Reveal";
import MotionCard from "./MotionCard";
import { FiFolder, FiStar, FiUsers, FiFile } from "react-icons/fi";
import "./ProjectsSection.css";

const ProjectsSection = () => {
  return (
    <section className="projects section" id="projects" style={{ overflow: 'hidden', boxSizing: 'border-box' }}>
      <Reveal className="center">
        <div className="kicker">Project Workspace</div>
        <h2 className="h2">Organize & Track Projects</h2>
        <p className="muted">Keep your creative work organized with powerful project management tools. Filter, search, and collaborate seamlessly.</p>
      </Reveal>

      <div className="projects-workspace-grid">
        {/* Main Dashboard Preview Card */}
        <Reveal>
          <MotionCard className="dashboard-preview-card">
            {/* Blurred background screenshot simulation */}
            <div className="dashboard-screenshot">
              {/* Simulated dashboard content */}
              <div className="screenshot-header">
                <div className="screenshot-nav">
                  <div className="nav-item active">Recent Projects</div>
                  <div className="nav-item">Client Work</div>
                  <div className="nav-item">Templates</div>
                </div>
              </div>
              <div className="screenshot-grid">
                <div className="screenshot-card"></div>
                <div className="screenshot-card"></div>
                <div className="screenshot-card"></div>
              </div>
            </div>
            
            {/* Glass overlay with content */}
            <div className="dashboard-overlay">
              <div className="overlay-icon">
                <FiFolder size={28} />
              </div>
              <h3 className="overlay-title">Your Projects Dashboard</h3>
              <p className="overlay-subtitle">Filter, search and organize everything in one workspace.</p>
              <button className="btn btn-open-projects">
                Open Projects
              </button>
            </div>
          </MotionCard>
        </Reveal>

        {/* Stats Box */}
        <Reveal delay={0.1}>
          <MotionCard className="stats-card card">
            <div className="stats-header">
              <h4 className="stats-title">Workspace Stats</h4>
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <FiFolder size={20} />
                </div>
                <div className="stat-content">
                  <div className="stat-number">24</div>
                  <div className="stat-label">Projects</div>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                  <FiStar size={20} />
                </div>
                <div className="stat-content">
                  <div className="stat-number">6</div>
                  <div className="stat-label">Favorites</div>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                  <FiUsers size={20} />
                </div>
                <div className="stat-content">
                  <div className="stat-number">12</div>
                  <div className="stat-label">Team Members</div>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                  <FiFile size={20} />
                </div>
                <div className="stat-content">
                  <div className="stat-number">183</div>
                  <div className="stat-label">Files</div>
                </div>
              </div>
            </div>
          </MotionCard>
        </Reveal>
      </div>
    </section>
  );
};

export default ProjectsSection;