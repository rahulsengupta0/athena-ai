import React from 'react';
import './Team.css';

const Teamintro = ({ activeTab = 'Members', onTabChange = () => {}, onFilterClick = () => {} }) => {
  const tabs = [
    { key: 'Members', label: 'Members' },
    { key: 'Invites', label: 'Invites' },
    { key: 'Roles', label: 'Roles' },
  ];

  return (
    <div className="team-wrapper">
      <div className="team-header">
        <div className="header-left">
          <div className="header-icon">👥</div>
          <div>
            <h1 className="team-title">Team Management</h1>
            <p className="team-subtitle">Manage your team members and collaborations</p>
          </div>
        </div>
        <button className="primary-btn">Invite Member</button>
      </div>

      {/* KPI Cards */}
      <div className="team-kpis">
        <div className="kpi-card">
          <div className="kpi-title">Total Members</div>
          <div className="kpi-value">5</div>
          <div className="kpi-trend up">+2 this month</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Active Projects</div>
          <div className="kpi-value">78</div>
          <div className="kpi-trend up">+12 this week</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Avg. Response Time</div>
          <div className="kpi-value">2.3h</div>
          <div className="kpi-trend good">-15min improvement</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="team-tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`team-tab ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => onTabChange(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="team-search-row">
        <div className="search-input-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input className="search-input" placeholder="Search team members..." />
        </div>
        <button className="secondary-btn" onClick={onFilterClick}>Filter</button>
      </div>
    </div>
  );
};

export default Teamintro;


