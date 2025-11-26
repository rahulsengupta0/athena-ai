import React from "react";
import Reveal from "./Reveal";
import MotionCard from "./MotionCard";
import { 
  FiLayers, 
  FiZap, 
  FiUsers, 
  FiTrendingUp, 
  FiAward,
  FiCheckCircle,
  FiStar,
  FiTarget
} from "react-icons/fi";
import "./WhyChoose.css";

const WhyChoose = () => {
  // Key advantages with icons
  const advantages = [
    {
      icon: FiLayers,
      title: '8 AI Tools in One',
      desc: 'Design, write, code, create videos — everything you need without switching platforms',
      stat: '8 Tools',
      color: '#667eea'
    },
    {
      icon: FiZap,
      title: '6× Faster Creation',
      desc: 'Generate professional content in seconds with 94%+ AI accuracy',
      stat: '6× Speed',
      color: '#f093fb'
    },
    {
      icon: FiUsers,
      title: 'Built for Teams',
      desc: 'Real-time collaboration, comments, and seamless project sharing',
      stat: 'Real-time',
      color: '#4facfe'
    },
    {
      icon: FiTrendingUp,
      title: 'Smart Analytics',
      desc: 'Track performance, productivity insights, and data-driven improvements',
      stat: 'AI Insights',
      color: '#43e97b'
    },
  ];

  // Comparison highlights
  const highlights = [
    { label: 'All-in-one platform', value: true },
    { label: 'Team collaboration', value: true },
    { label: 'Smart analytics', value: true },
    { label: 'Brand consistency', value: true },
  ];

  return (
    <section className="why section">
      <Reveal className="center">
        <div className="kicker">The Athena Advantage</div>
        <h2 className="h2">Why Creators & Teams Choose Us</h2>
        <p className="muted">
          Stop juggling multiple tools. Get everything you need in one powerful, AI-driven creative suite.
        </p>
      </Reveal>

      {/* Main advantages grid */}
      <div className="why-advantages-grid">
        {advantages.map((adv, idx) => (
          <Reveal key={idx} delay={0.1 + idx * 0.08}>
            <MotionCard className="advantage-card">
              <div className="advantage-icon-wrapper" style={{ background: `${adv.color}15` }}>
                <adv.icon size={28} style={{ color: adv.color }} />
              </div>
              <div className="advantage-content">
                <h3 className="advantage-title">{adv.title}</h3>
                <p className="advantage-desc">{adv.desc}</p>
              </div>
              <div className="advantage-stat" style={{ color: adv.color }}>
                {adv.stat}
              </div>
            </MotionCard>
          </Reveal>
        ))}
      </div>

      {/* Bottom comparison section */}
      <div className="why-bottom-layout">
        {/* Left: Feature Comparison */}
        <Reveal delay={0.25}>
          <MotionCard className="comparison-card">
            <div className="comparison-header">
              <FiAward size={24} className="comparison-icon" />
              <h3 className="comparison-title">What Makes Us Different</h3>
            </div>
            
            <div className="comparison-list">
              {highlights.map((item, idx) => (
                <Reveal key={idx} delay={0.3 + idx * 0.05}>
                  <div className="comparison-item">
                    <div className="check-icon-wrapper">
                      <FiCheckCircle size={20} />
                    </div>
                    <span className="comparison-label">{item.label}</span>
                    <FiStar size={16} className="star-highlight" />
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="comparison-note">
              <FiTarget size={18} />
              <span>Trusted by 1,200+ creative teams</span>
            </div>
          </MotionCard>
        </Reveal>

        {/* Right: Stats Showcase */}
        <Reveal delay={0.3}>
          <MotionCard className="stats-showcase-card">
            <div className="stats-showcase-header">
              <h4>By the Numbers</h4>
              <div className="growth-badge">
                <FiTrendingUp size={14} />
                <span>Growing Fast</span>
              </div>
            </div>

            <div className="stats-showcase-grid">
              <Reveal delay={0.35}>
                <div className="stat-showcase-item">
                  <div className="stat-showcase-value" style={{ color: '#667eea' }}>94%</div>
                  <div className="stat-showcase-label">AI Accuracy</div>
                  <div className="stat-showcase-bar" style={{ width: '94%', background: '#667eea' }}></div>
                </div>
              </Reveal>

              <Reveal delay={0.4}>
                <div className="stat-showcase-item">
                  <div className="stat-showcase-value" style={{ color: '#f093fb' }}>1.2K+</div>
                  <div className="stat-showcase-label">Projects Created</div>
                  <div className="stat-showcase-bar" style={{ width: '85%', background: '#f093fb' }}></div>
                </div>
              </Reveal>

              <Reveal delay={0.45}>
                <div className="stat-showcase-item">
                  <div className="stat-showcase-value" style={{ color: '#43e97b' }}>127h</div>
                  <div className="stat-showcase-label">Time Saved</div>
                  <div className="stat-showcase-bar" style={{ width: '78%', background: '#43e97b' }}></div>
                </div>
              </Reveal>
            </div>

            <div className="stats-showcase-footer">
              Results from the last 30 days
            </div>
          </MotionCard>
        </Reveal>
      </div>
    </section>
  );
};

export default WhyChoose;
