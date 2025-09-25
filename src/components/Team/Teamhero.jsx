import React from 'react';
import './Team.css';

const MemberCard = ({ initials, name, role, email, tag, dept, projects, since, statusColor = '#22c55e' }) => (
  <div className="member-card">
    <div className="member-card-header">
      <div className="avatar" style={{ background: '#ede7fe', color: '#5f5aad' }}>{initials}</div>
      <div className="member-info">
        <div className="member-name-row">
          <div className="status-dot" style={{ background: statusColor }} />
          <div className="member-name">{name}</div>
          <span className="member-badge">{tag}</span>
        </div>
        <div className="member-role">{role}</div>
      </div>
      <button className="icon-btn" aria-label="More">⋯</button>
    </div>
    <div className="member-meta">
      <div className="meta-row">
        <span className="meta-icon">✉️</span>
        <span>{email}</span>
      </div>
      <div className="meta-grid">
        <div className="meta-pill">{projects} projects</div>
        <div className="meta-pill">{dept}</div>
        <div className="meta-muted">Since {since}</div>
      </div>
    </div>
  </div>
);

const Teamhero = () => {
  const members = [
    { initials: 'AT', name: 'Alex Thompson', role: 'Owner', email: 'alex@athenaai.com', tag: 'owner', dept: 'Leadership', projects: 24, since: 'Jan 2023' },
    { initials: 'SC', name: 'Sarah Chen', role: 'Creative Director', email: 'sarah@athenaai.com', tag: 'admin', dept: 'Design', projects: 18, since: 'Mar 2023', statusColor: '#60a5fa' },
    { initials: 'MR', name: 'Michael Rodriguez', role: 'AI Specialist', email: 'michael@athenaai.com', tag: 'member', dept: 'Technology', projects: 12, since: 'May 2023', statusColor: '#fbbf24' },
    { initials: 'ED', name: 'Emily Davis', role: 'Content Manager', email: 'emily@athenaai.com', tag: 'member', dept: 'Marketing', projects: 14, since: 'Jul 2023' },
  ];

  return (
    <div className="members-grid">
      {members.map((m) => (
        <MemberCard key={m.email} {...m} />
      ))}
    </div>
  );
};

export default Teamhero;


