import React, { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import TempUpload from '../components/admin/TempUpload';
import TemplateManager from '../components/admin/TemplateManager';
import './AdminDash.css';

const AdminDash = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Primary view toggle and create modal controls
  const [activeView, setActiveView] = useState('create');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPostOptions, setShowPostOptions] = useState(false);
  const [selectedTemplateType, setSelectedTemplateType] = useState('');

  const postOptions = useMemo(
    () => [
      'Insta Post',
      'Insta Story',
      'Facebook Post',
      'YouTube Thumbnail',
      'WhatsApp Status',
      'Custom',
    ],
    []
  );

  const handlePresentationLaunch = () => {
    setShowCreateModal(false);
    navigate('/presentation');
  };

  const handleTemplateSelect = (type) => {
    setSelectedTemplateType(type);
    setShowCreateModal(false);
    setShowPostOptions(false);
    setActiveView('create');
  };

  return (
    <div className="admin-dash">
      <div className="admin-dash__shell">
        <div className="admin-dash__container">
          <section className="admin-hero">
            <div className="admin-hero__text">
              <p className="admin-hero__eyebrow">Welcome back, {user?.firstName || 'Admin'}</p>
              <h1>Create or manage templates from one place</h1>
              <p className="admin-hero__subtext">
                Choose what you want to build and jump into the right workspace. Presentation opens
                the layout picker instantly.
              </p>
            </div>

            <div className="admin-hero__actions">
              <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                + Create Template
              </button>
              <button
                className={`btn btn-ghost ${activeView === 'manage' ? 'is-active' : ''}`}
                onClick={() => setActiveView('manage')}
              >
                Manage Templates
              </button>
            </div>
          </section>

          <div className="admin-status">
            <div className="admin-status__left">
              <span className="status-dot" />
              <strong>Creation mode:</strong>
              <span className="status-label">
                {selectedTemplateType ? selectedTemplateType : 'Not chosen yet'}
              </span>
            </div>
            <div className="admin-status__right">
              View: {activeView === 'create' ? 'Create workspace' : 'Manage & delete'}
            </div>
          </div>

          <div className="admin-workspace">
            {activeView === 'create' ? <TempUpload /> : <TemplateManager />}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="admin-modal__backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <div>
                <p className="admin-modal__eyebrow">New template</p>
                <h2>Choose what you want to create</h2>
              </div>
              <button className="admin-modal__close" onClick={() => setShowCreateModal(false)}>
                ×
              </button>
            </div>

            <div className="admin-modal__grid">
              <div className="modal-card modal-card--green">
                <div className="modal-card__title">Presentation</div>
                <p className="modal-card__body">
                  Jump straight into the presentation layout picker to select the perfect slide
                  format.
                </p>
                <button className="btn btn-primary" onClick={handlePresentationLaunch}>
                  Open Layout Picker
                </button>
              </div>

              <div className={`modal-card modal-card--indigo ${showPostOptions ? 'is-open' : ''}`}>
                <div className="modal-card__title">Post</div>
                <p className="modal-card__body">
                  Pick a social format to preselect canvas sizing for uploads.
                </p>
                <button className="btn btn-secondary" onClick={() => setShowPostOptions((v) => !v)}>
                  Choose format ▾
                </button>

                {showPostOptions && (
                  <div className="modal-card__dropdown">
                    {postOptions.map((option) => (
                      <button
                        key={option}
                        className="dropdown-item"
                        onClick={() => handleTemplateSelect(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-card modal-card--amber">
                <div className="modal-card__title">Logo</div>
                <p className="modal-card__body">
                  Start with a square canvas ideal for logo uploads or quick drafts.
                </p>
                <button className="btn btn-secondary" onClick={() => handleTemplateSelect('Logo')}>
                  Use Logo canvas
                </button>
              </div>

              <div className="modal-card modal-card--teal">
                <div className="modal-card__title">Business Card</div>
                <p className="modal-card__body">
                  Keep standard 3.5 × 2 inch proportions ready for print cards.
                </p>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleTemplateSelect('Business Card')}
                >
                  Use Business Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDash;