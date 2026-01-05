import React, { useState, useEffect, useRef } from 'react';
import { FiMoreHorizontal, FiTrash2, FiEye } from 'react-icons/fi';
import './Team.css';

const MemberCard = ({ 
  member, 
  onRemove, 
  onViewProjects,
  statusColor = '#22c55e' 
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);
  
  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return first + last || 'U';
  };

  const getRoleDisplay = (role) => {
    const roleMap = {
      owner: 'Owner',
      admin: 'Admin',
      member: 'Member'
    };
    return roleMap[role] || 'Member';
  };

  const getStatusColor = (status) => {
    const statusMap = {
      active: '#22c55e',
      pending: '#fbbf24',
      inactive: '#ef4444'
    };
    return statusMap[status] || '#22c55e';
  };

  const formatDate = (date) => {
    if (!date) return 'Recently';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const initials = getInitials(member.userId?.firstName, member.userId?.lastName);
  const name = `${member.userId?.firstName || ''} ${member.userId?.lastName || ''}`.trim() || member.userId?.email || 'Unknown';
  const email = member.userId?.email || '';
  const role = getRoleDisplay(member.role);
  const tag = member.role;
  const projects = member.projects || 0;
  const since = formatDate(member.joinedAt || member.createdAt);
  const status = member.status || 'active';
  const color = getStatusColor(status);

  return (
    <div className="member-card">
      <div className="member-card-header">
        <div className="avatar" style={{ background: '#ede7fe', color: '#5f5aad' }}>
          {member.userId?.avatar ? (
            <img 
              src={member.userId.avatar} 
              alt={name}
              style={{ width: '100%', height: '100%', borderRadius: 12, objectFit: 'cover' }}
            />
          ) : (
            initials
          )}
        </div>
        <div className="member-info">
          <div className="member-name-row">
            <div className="status-dot" style={{ background: color }} />
            <div className="member-name">{name}</div>
            <span className={`member-badge ${tag}`}>{tag}</span>
          </div>
          <div className="member-role">{role}</div>
        </div>
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button 
            className="icon-btn" 
            aria-label="More"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FiMoreHorizontal size={18} />
          </button>
          {menuOpen && (
            <div className="member-menu">
              <button 
                className="menu-item"
                onClick={() => {
                  onViewProjects(member.userId._id);
                  setMenuOpen(false);
                }}
              >
                <FiEye size={16} />
                View Projects
              </button>
              {onRemove && member.role !== 'owner' && (
                <button 
                  className="menu-item danger"
                  onClick={() => {
                    onRemove(member._id);
                    setMenuOpen(false);
                  }}
                >
                  <FiTrash2 size={16} />
                  Remove
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="member-meta">
        <div className="meta-row">
          <span className="meta-icon">✉️</span>
          <span>{email}</span>
        </div>
        <div className="meta-grid">
          <div className="meta-pill">{projects} {projects === 1 ? 'project' : 'projects'}</div>
          <div className="meta-pill">{status}</div>
          <div className="meta-muted">Since {since}</div>
        </div>
      </div>
    </div>
  );
};

const Teamhero = ({ members, loading, onRemove, onViewProjects }) => {
  if (loading) {
    return (
      <div className="members-grid" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
        Loading team members...
      </div>
    );
  }

  if (!members || members.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">👥</div>
        <div className="empty-state-text">No team members yet</div>
        <div className="empty-state-subtext">Invite team members to start collaborating</div>
      </div>
    );
  }

  return (
    <div className="members-grid">
      {members.map((member) => (
        <MemberCard 
          key={member._id || member.userId?._id} 
          member={member}
          onRemove={onRemove}
          onViewProjects={onViewProjects}
        />
      ))}
    </div>
  );
};

export default Teamhero;


