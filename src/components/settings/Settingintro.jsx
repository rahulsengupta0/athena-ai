import React, { useState } from 'react';
import './Settingintro.css';

const Settingintro = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('AT');
  
  const [profileData, setProfileData] = useState({
    firstName: 'Alex',
    lastName: 'Thompson',
    email: 'alex@example.com',
    bio: 'Creative designer passionate about AI-powered design tools.',
    website: 'https://alexthompson.design'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const tabs = ['Profile', 'Notifications', 'Appearance', 'Privacy', 'Billing', 'Advanced'];

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    console.log('Saving profile:', profileData);
    // Add save logic here
  };

  const handleUpdatePassword = () => {
    console.log('Updating password:', passwordData);
    // Add password update logic here
  };

  const avatarOptions = [
    'AT', '👩🏻‍💻', '🧑🏽‍🎨', '🤖', '🧠', '🚀',
    '🌈', '🎨', '✨', '🦄', '🛰️', '📐',
    'https://i.pravatar.cc/120?img=1',
    'https://i.pravatar.cc/120?img=5',
    'https://i.pravatar.cc/120?img=12',
    'https://i.pravatar.cc/120?img=23'
  ];

  const openAvatarModal = () => setIsAvatarModalOpen(true);
  const closeAvatarModal = () => setIsAvatarModalOpen(false);
  const saveAvatar = () => {
    // Here you could persist avatar selection to backend
    closeAvatarModal();
  };

  const renderProfileTab = () => (
    <div className="profile-tab">
      <div className="profile-header">
        <h2>Profile Information</h2>
        <p>Update your personal information and profile settings</p>
      </div>

      <div className="avatar-section">
        <div className="avatar-container">
          <div className="avatar">
            {String(selectedAvatar).startsWith('http') ? (
              <img src={selectedAvatar} alt="avatar" className="avatar-img" />
            ) : (
              <span>{selectedAvatar}</span>
            )}
          </div>
          <div className="avatar-actions">
            <button className="change-avatar-btn" onClick={openAvatarModal}>Change Avatar</button>
            <p className="avatar-hint">JPG, GIF or PNG. Max size 2MB.</p>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={profileData.firstName}
              onChange={(e) => handleProfileChange('firstName', e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={profileData.lastName}
              onChange={(e) => handleProfileChange('lastName', e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={profileData.email}
            onChange={(e) => handleProfileChange('email', e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            value={profileData.bio}
            onChange={(e) => handleProfileChange('bio', e.target.value)}
            className="form-textarea"
            rows="3"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="website">Website</label>
          <input
            type="url"
            id="website"
            value={profileData.website}
            onChange={(e) => handleProfileChange('website', e.target.value)}
            className="form-input"
            placeholder="https://yourwebsite.com"
          />
        </div>

        <button className="save-btn" onClick={handleSaveProfile}>
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderPasswordTab = () => (
    <div className="password-tab">
      <div className="password-header">
        <h2>Change Password</h2>
        <p>Ensure your account stays secure with a strong password</p>
      </div>

      <div className="form-section">
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <div className="password-input-container">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              id="currentPassword"
              value={passwordData.currentPassword}
              onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
              className="form-input"
              placeholder="Enter current password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <div className="password-input-container">
            <input
              type={showNewPassword ? 'text' : 'password'}
              id="newPassword"
              value={passwordData.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              className="form-input"
              placeholder="Enter new password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              className="form-input"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        <button className="update-password-btn" onClick={handleUpdatePassword}>
          Update Password
        </button>
      </div>
    </div>
  );

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account preferences and settings</p>
      </div>

      <div className="settings-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="settings-content">
        {activeTab === 'Profile' && renderProfileTab()}
        {activeTab === 'Notifications' && (
          <div className="coming-soon">
            <h2>Notifications</h2>
            <p>Notification settings coming soon...</p>
          </div>
        )}
        {activeTab === 'Appearance' && (
          <div className="coming-soon">
            <h2>Appearance</h2>
            <p>Appearance settings coming soon...</p>
          </div>
        )}
        {activeTab === 'Privacy' && (
          <div className="coming-soon">
            <h2>Privacy</h2>
            <p>Privacy settings coming soon...</p>
          </div>
        )}
        {activeTab === 'Billing' && (
          <div className="coming-soon">
            <h2>Billing</h2>
            <p>Billing settings coming soon...</p>
          </div>
        )}
        {activeTab === 'Advanced' && (
          <div className="coming-soon">
            <h2>Advanced</h2>
            <p>Advanced settings coming soon...</p>
          </div>
        )}
      </div>

      {isAvatarModalOpen && (
        <div className="modal-overlay" onClick={closeAvatarModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Choose an avatar</h3>
              <button className="modal-close" onClick={closeAvatarModal} aria-label="Close">✕</button>
            </div>
            <div className="modal-body">
              <div className="avatar-grid">
                {avatarOptions.map((opt) => (
                  <button
                    key={opt}
                    className={`avatar-option ${selectedAvatar === opt ? 'selected' : ''}`}
                    onClick={() => setSelectedAvatar(opt)}
                    aria-label={`Select avatar ${opt}`}
                  >
                    {String(opt).startsWith('http') ? (
                      <img src={opt} alt="avatar option" />
                    ) : (
                      <span>{opt}</span>
                    )}
                  </button>
                ))}
              </div>
              <div className="modal-actions">
                <button className="secondary-btn" onClick={closeAvatarModal}>Cancel</button>
                <button className="primary-btn" onClick={saveAvatar}>Save & Proceed</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settingintro;
