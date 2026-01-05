import React, { useState, useEffect } from 'react';
import { FiX, FiFolder } from 'react-icons/fi';
import api from '../../services/api';
import './Team.css';

const ProjectsModal = ({ isOpen, onClose, memberId, memberName }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && memberId) {
      fetchProjects();
    }
  }, [isOpen, memberId]);

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getMemberProjects(memberId);
      setProjects(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <FiFolder style={{ marginRight: 8, verticalAlign: 'middle' }} />
            {memberName}'s Projects
          </h2>
          <button className="modal-close" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', maxHeight: '60vh', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              Loading projects...
            </div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📁</div>
              <div className="empty-state-text">No projects found</div>
              <div className="empty-state-subtext">This team member hasn't created any projects yet</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {projects.map((project) => (
                <div
                  key={project._id}
                  style={{
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '1rem',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#dddaf5';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111827', marginBottom: '0.5rem' }}>
                    {project.title}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    {project.desc}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        background: '#e5e7eb',
                        color: '#374151',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}
                    >
                      {project.category}
                    </span>
                    <span
                      style={{
                        background: project.status === 'Completed' ? '#d1fae5' : 
                                   project.status === 'In Progress' ? '#dbeafe' :
                                   project.status === 'Draft' ? '#fef3c7' : '#f3e8ff',
                        color: project.status === 'Completed' ? '#059669' :
                               project.status === 'In Progress' ? '#2563eb' :
                               project.status === 'Draft' ? '#d97706' : '#7c3aed',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        fontSize: '0.8rem',
                        fontWeight: 700
                      }}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsModal;

