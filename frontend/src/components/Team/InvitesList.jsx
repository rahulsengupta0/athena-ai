import React from 'react';
import { FiTrash2, FiMail, FiClock } from 'react-icons/fi';
import './Team.css';

const InvitesList = ({ invites, loading, onCancel }) => {
  if (loading) {
    return (
      <div className="invites-list" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
        Loading invites...
      </div>
    );
  }

  if (!invites || invites.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📧</div>
        <div className="empty-state-text">No pending invites</div>
        <div className="empty-state-subtext">Invite team members to get started</div>
      </div>
    );
  }

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="invites-list">
      {invites.map((invite) => {
        const expired = isExpired(invite.expiresAt);
        const status = expired ? 'expired' : invite.status;

        return (
          <div key={invite._id} className="invite-item">
            <div className="invite-info">
              <div className="invite-email">
                <FiMail style={{ marginRight: 8, verticalAlign: 'middle' }} />
                {invite.email}
              </div>
              <div className="invite-meta">
                <span className={`invite-status ${status}`}>{status}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <FiClock size={14} />
                  {expired ? 'Expired' : `Expires ${formatDate(invite.expiresAt)}`}
                </span>
                <span>Role: {invite.role}</span>
              </div>
            </div>
            {status === 'pending' && !expired && (
              <div className="invite-actions">
                <button
                  className="btn-small btn-danger"
                  onClick={() => onCancel(invite._id)}
                  title="Cancel invite"
                >
                  <FiTrash2 size={14} style={{ marginRight: 4 }} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default InvitesList;

