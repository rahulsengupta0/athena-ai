import React from "react";
import Reveal from "./Reveal";
import MotionCard from "./MotionCard";
import { FiTrendingUp, FiActivity, FiZap, FiClock, FiBarChart2 } from "react-icons/fi";
import "./AnalyticsSection.css";

const AnalyticsSection = () => {
  // Stats data
  const stats = [
    { label: 'Projects', value: '247', trend: '+23%', color: '#667eea' },
    { label: 'AI Gens', value: '1.8K', trend: '+45%', color: '#f093fb' },
    { label: 'Time Saved', value: '127h', trend: '+67%', color: '#43e97b' },
  ];

  // Chart data for breakdown
  const chartData = [
    { label: 'Design', percent: 45, color: '#667eea' },
    { label: 'Content', percent: 28, color: '#f093fb' },
    { label: 'Video', percent: 18, color: '#4facfe' },
    { label: 'Code', percent: 9, color: '#43e97b' },
  ];

  // Recent activity
  const activities = [
    { title: 'Generated design template', quality: '96%', time: '2h ago' },
    { title: 'Enhanced product photos', quality: '94%', time: '4h ago' },
    { title: 'Created video intro', quality: '98%', time: '1d ago' },
  ];

  return (
    <section className="analytics section" id="analytics">
      <Reveal className="center">
        <div className="kicker">Analytics & Insights</div>
        <h2 className="h2">Track Your Creative Impact</h2>
        <p className="muted">
          Understand what works, measure productivity, and get AI-powered insights to improve your workflow.
        </p>
      </Reveal>

      <div className="analytics-modern-layout">
        {/* Left: Main Analytics Dashboard */}
        <div className="analytics-left-section">
          {/* Stats Cards Row */}
          <div className="stats-cards-row">
            {stats.map((stat, idx) => (
              <Reveal key={stat.label} delay={0.1 + idx * 0.05}>
                <MotionCard className="analytics-stat-card">
                  <div className="stat-card-label">{stat.label}</div>
                  <div className="stat-card-value" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className="stat-card-trend">
                    <FiTrendingUp size={14} />
                    <span>{stat.trend}</span>
                  </div>
                </MotionCard>
              </Reveal>
            ))}
          </div>

          {/* Chart Visualization */}
          <Reveal delay={0.25}>
            <MotionCard className="analytics-chart-card">
              <div className="chart-header">
                <div className="chart-title">
                  <FiBarChart2 size={22} />
                  <h4>Project Breakdown</h4>
                </div>
                <div className="chart-subtitle">Distribution by type</div>
              </div>

              <div className="chart-bars">
                {chartData.map((item, idx) => (
                  <Reveal key={item.label} delay={0.3 + idx * 0.05}>
                    <div className="chart-bar-row">
                      <div className="bar-label-section">
                        <div 
                          className="bar-color-dot" 
                          style={{ background: item.color }}
                        ></div>
                        <span className="bar-label">{item.label}</span>
                      </div>
                      <div className="bar-value">{item.percent}%</div>
                    </div>
                    <div className="bar-track">
                      <div 
                        className="bar-fill" 
                        style={{ 
                          width: `${item.percent}%`,
                          background: item.color 
                        }}
                      ></div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </MotionCard>
          </Reveal>
        </div>

        {/* Right: Activity Feed & Insights */}
        <div className="analytics-right-section">
          {/* Recent Activity */}
          <Reveal delay={0.15}>
            <MotionCard className="activity-feed-card">
              <div className="activity-header">
                <div className="activity-icon">
                  <FiActivity size={18} />
                </div>
                <h4 className="activity-title">Recent Activity</h4>
              </div>
              <div className="activity-subtitle">Latest AI creations</div>

              <div className="activity-list">
                {activities.map((activity, idx) => (
                  <Reveal key={idx} delay={0.2 + idx * 0.05}>
                    <div className="activity-item">
                      <div className="activity-dot"></div>
                      <div className="activity-content">
                        <div className="activity-title-text">{activity.title}</div>
                        <div className="activity-meta">
                          <span className="activity-quality">{activity.quality} quality</span>
                          <span className="activity-time">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </MotionCard>
          </Reveal>

          {/* Performance Insight */}
          <Reveal delay={0.3}>
            <MotionCard className="insight-card">
              <div className="insight-icon-wrapper">
                <FiZap size={22} />
              </div>
              <h4 className="insight-title">Peak Productivity</h4>
              <p className="insight-desc">
                You're most productive between 2-4 PM. Schedule complex tasks during this time.
              </p>
              <div className="insight-badge">
                <FiClock size={14} />
                <span>AI Insight</span>
              </div>
            </MotionCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsSection;