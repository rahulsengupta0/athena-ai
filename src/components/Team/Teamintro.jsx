import React from 'react';
import { FiSearch } from 'react-icons/fi';
import './Team.css';

const Teamintro = ({ 
  activeTab = 'Members', 
  onTabChange = () => {}, 
  onFilterClick = () => {},
  onInviteClick = () => {},
  stats = { totalMembers: 0, totalProjects: 0, pendingInvites: 0 },
  searchQuery = '',
  onSearchChange = () => {}
}) => {
  const tabs = [
    { key: 'Members', label: 'Members' },
    { key: 'Invites', label: 'Invites' },
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
        <button className="primary-btn" onClick={onInviteClick}>
          Invite Member
        </button>
      </div>

      {/* KPI Cards */}
      <div className="team-kpis">
        <div className="kpi-card">
          <div className="kpi-title">Total Members</div>
          <div className="kpi-value">{stats.totalMembers || 0}</div>
          <div className="kpi-trend up">Active team members</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Active Projects</div>
          <div className="kpi-value">{stats.totalProjects || 0}</div>
          <div className="kpi-trend up">Team projects</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Pending Invites</div>
          <div className="kpi-value">{stats.pendingInvites || 0}</div>
          <div className="kpi-trend good">Awaiting response</div>
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
      {activeTab === 'Members' && (
        <div className="team-search-row">
          <div className="search-input-wrap">
            <FiSearch style={{ position: 'absolute', left: 10, color: '#6b7280' }} size={18} />
            <input 
              className="search-input" 
              placeholder="Search team members..." 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <button className="secondary-btn" onClick={onFilterClick}>Filter</button>
        </div>
      )}
    </div>
  );
};

export default Teamintro;


