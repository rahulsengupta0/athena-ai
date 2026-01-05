import React, { useState } from 'react';
import './Settinghero.css';
import api from '../../services/api';

const Settinghero = () => {
  const [website, setWebsite] = useState('https://alexthompson.design');
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleWebsiteChange = (e) => {
    setWebsite(e.target.value);
  };

  const handlePasswordChange = (field, value) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSaveWebsite = () => {
    console.log('Saving website:', website);
    // Add save logic here
  };

  const handleUpdatePassword = async () => {
    // Validate passwords
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      alert('Please fill in all password fields');
      return;
    }

    if (passwords.new !== passwords.confirm) {
      alert('New password and confirm password do not match');
      return;
    }

    if (passwords.new.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }

    try {
      await api.changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.new,
        confirmPassword: passwords.confirm
      });
      
      // Clear password fields on success
      setPasswords({
        current: '',
        new: '',
        confirm: ''
      });
      
      alert('Password changed successfully!');
      console.log('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      const errorMessage = error.message || 'Failed to update password. Please try again.';
      alert(errorMessage);
    }
  };

  return (
    <div className="settings-hero">
      <div className="settings-container">
        {/* Website Section */}
        <div className="settings-section">
          <div className="section-header">
            <h2 className="section-title">Website</h2>
          </div>
          <div className="section-content">
            <div className="input-group">
              <input
                type="url"
                value={website}
                onChange={handleWebsiteChange}
                className="website-input"
                placeholder="https://yourwebsite.com"
              />
            </div>
            <button 
              className="save-btn"
              onClick={handleSaveWebsite}
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="settings-section">
          <div className="section-header">
            <h2 className="section-title">Change Password</h2>
            <p className="section-description">
              Ensure your account stays secure with a strong password
            </p>
          </div>
          <div className="section-content">
            <div className="password-fields">
              {/* Current Password */}
              <div className="input-group">
                <label htmlFor="current-password" className="input-label">
                  Current Password
                </label>
                <div className="password-input-container">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    id="current-password"
                    value={passwords.current}
                    onChange={(e) => handlePasswordChange('current', e.target.value)}
                    className="password-input"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('current')}
                    aria-label={showPasswords.current ? 'Hide password' : 'Show password'}
                  >
                    {showPasswords.current ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3L21 21M9.9 9.9C9.5 10.3 9.2 10.8 9.2 11.4C9.2 12.7 10.3 13.8 11.6 13.8C12.2 13.8 12.7 13.5 13.1 13.1M15.2 15.2C14.1 16.1 12.6 16.6 11 16.6C7.1 16.6 3.7 13.2 2 8.6C2.8 6.8 3.9 5.3 5.2 4.1L15.2 15.2ZM22 8.6C20.1 12.1 16.2 15.6 11 15.6C10.1 15.6 9.2 15.4 8.4 15.1L22 8.6ZM8.4 8.4L15.6 15.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="input-group">
                <label htmlFor="new-password" className="input-label">
                  New Password
                </label>
                <div className="password-input-container">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    id="new-password"
                    value={passwords.new}
                    onChange={(e) => handlePasswordChange('new', e.target.value)}
                    className="password-input"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('new')}
                    aria-label={showPasswords.new ? 'Hide password' : 'Show password'}
                  >
                    {showPasswords.new ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3L21 21M9.9 9.9C9.5 10.3 9.2 10.8 9.2 11.4C9.2 12.7 10.3 13.8 11.6 13.8C12.2 13.8 12.7 13.5 13.1 13.1M15.2 15.2C14.1 16.1 12.6 16.6 11 16.6C7.1 16.6 3.7 13.2 2 8.6C2.8 6.8 3.9 5.3 5.2 4.1L15.2 15.2ZM22 8.6C20.1 12.1 16.2 15.6 11 15.6C10.1 15.6 9.2 15.4 8.4 15.1L22 8.6ZM8.4 8.4L15.6 15.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="input-group">
                <label htmlFor="confirm-password" className="input-label">
                  Confirm New Password
                </label>
                <div className="password-input-container">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    id="confirm-password"
                    value={passwords.confirm}
                    onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                    className="password-input"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('confirm')}
                    aria-label={showPasswords.confirm ? 'Hide password' : 'Show password'}
                  >
                    {showPasswords.confirm ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3L21 21M9.9 9.9C9.5 10.3 9.2 10.8 9.2 11.4C9.2 12.7 10.3 13.8 11.6 13.8C12.2 13.8 12.7 13.5 13.1 13.1M15.2 15.2C14.1 16.1 12.6 16.6 11 16.6C7.1 16.6 3.7 13.2 2 8.6C2.8 6.8 3.9 5.3 5.2 4.1L15.2 15.2ZM22 8.6C20.1 12.1 16.2 15.6 11 15.6C10.1 15.6 9.2 15.4 8.4 15.1L22 8.6ZM8.4 8.4L15.6 15.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <button 
              className="update-password-btn"
              onClick={handleUpdatePassword}
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settinghero;
