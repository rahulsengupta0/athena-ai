import React from "react";
import Reveal from "./Reveal";
import MotionCard from "./MotionCard";
import { FiUsers, FiUserPlus, FiMessageCircle, FiZap, FiCheck } from "react-icons/fi";
import "./TeamSection.css";

const TeamSection = () => {
  // Team members with avatars and status
  const teamMembers = [
    { id: 1, name: 'Maya K.', role: 'Designer', color: '#667eea', initials: 'MK', status: 'online' },
    { id: 2, name: 'Alex R.', role: 'Developer', color: '#f093fb', initials: 'AR', status: 'online' },
    { id: 3, name: 'Sarah J.', role: 'Manager', color: '#4facfe', initials: 'SJ', status: 'away' },
    { id: 4, name: 'Rohit P.', role: 'Content', color: '#43e97b', initials: 'RP', status: 'online' },
  ];

  // Collaboration features
  const features = [
    { icon: FiUserPlus, title: 'Easy Invites', desc: 'Add teammates with a single click' },
    { icon: FiMessageCircle, title: 'Live Comments', desc: 'Discuss designs in real-time' },
    { icon: FiZap, title: 'Instant Sync', desc: 'See changes as they happen' },
  ];

  return (
    <section className="team section" id="team">
      <Reveal className="center">
        <div className="kicker">Team Collaboration</div>
        <h2 className="h2">Create Together, Ship Faster</h2>
        <p className="muted">
          Invite your team, collaborate in real-time, and bring your best ideas to life together.
        </p>
      </Reveal>

      <div className="team-modern-layout">
        {/* Left: Collaboration Preview */}
        <div className="team-left-section">
          <Reveal>
            <MotionCard className="collaboration-card">
              {/* Live collaboration indicator */}
              <div className="collab-header">
                <div className="live-indicator">
                  <span className="pulse-dot"></span>
                  <span className="live-text">4 people working</span>
                </div>
              </div>

              {/* Active team members avatars */}
              <div className="active-members-section">
                <h4 className="section-label">Active Now</h4>
                <div className="members-avatars-stack">
                  {teamMembers.map((member, idx) => (
                    <Reveal key={member.id} delay={0.1 + idx * 0.05}>
                      <div className="avatar-stack-item">
                        <div 
                          className="team-avatar"
                          style={{ background: member.color }}
                        >
                          {member.initials}
                          <div className={`status-indicator ${member.status}`}></div>
                        </div>
                        <div className="avatar-info">
                          <div className="avatar-name">{member.name}</div>
                          <div className="avatar-role">{member.role}</div>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>

              {/* Activity feed simulation */}
              <div className="activity-feed">
                <h4 className="section-label">Recent Activity</h4>
                <div className="activity-items">
                  <div className="activity-item">
                    <FiCheck className="activity-icon success" />
                    <div className="activity-text">
                      <span className="activity-user">Maya</span> completed design review
                    </div>
                  </div>
                  <div className="activity-item">
                    <FiMessageCircle className="activity-icon" />
                    <div className="activity-text">
                      <span className="activity-user">Alex</span> left a comment
                    </div>
                  </div>
                </div>
              </div>
            </MotionCard>
          </Reveal>

          {/* Team stats */}
          <Reveal delay={0.15}>
            <div className="team-stats-mini">
              <div className="stat-mini-item">
                <FiUsers size={18} />
                <span>12 Members</span>
              </div>
              <div className="stat-mini-divider"></div>
              <div className="stat-mini-item">
                <FiZap size={18} />
                <span>24 Projects</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right: Features Grid */}
        <div className="team-right-section">
          <Reveal delay={0.1}>
            <h3 className="features-heading">Why Teams Love It</h3>
          </Reveal>

          <div className="team-features-grid">
            {features.map((feature, idx) => (
              <Reveal key={idx} delay={0.15 + idx * 0.08}>
                <MotionCard className="team-feature-card">
                  <div className="feature-icon-wrapper">
                    <feature.icon size={24} />
                  </div>
                  <h4 className="feature-title">{feature.title}</h4>
                  <p className="feature-desc">{feature.desc}</p>
                </MotionCard>
              </Reveal>
            ))}
          </div>

          {/* CTA */}
          <Reveal delay={0.3}>
            <MotionCard className="team-cta-card">
              <div className="cta-content">
                <h4 className="cta-title">Ready to collaborate?</h4>
                <p className="cta-text">Start inviting your team today</p>
              </div>
              <button className="btn btn-team-cta">
                <FiUserPlus size={18} />
                Invite Team
              </button>
            </MotionCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;