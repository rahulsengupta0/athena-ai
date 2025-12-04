import React, { useState, useEffect, useMemo } from 'react';
import './Settingintro.css';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAvatarSource, getInitialsColors, generateDiceBearAvatar, DICEBEAR_STYLES } from './avatarUtils';

const AVATAR_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'initials', label: 'Initials' },
  { key: 'emoji', label: 'Emoji' },
];

// Generate DiceBear avatars with curated seeds for more predictable variety
const generateDiceBearCatalog = () => {
  const styles = ['adventurer', 'avataaars', 'bottts', 'fun', 'micah', 'personas', 'lorelei'];
  
  // Seeds that tend to produce more masculine appearances
  const maleSeeds = [
    'john', 'mike', 'david', 'james', 'robert', 'william', 'richard', 'joseph', 'thomas', 'charles',
    'daniel', 'matthew', 'anthony', 'mark', 'donald', 'steven', 'paul', 'andrew', 'joshua', 'kenneth',
    'kevin', 'brian', 'george', 'timothy', 'ronald', 'jason', 'edward', 'jeffrey', 'ryan', 'jacob',
    'gary', 'nicholas', 'eric', 'jonathan', 'stephen', 'larry', 'justin', 'scott', 'brandon', 'benjamin',
    'samuel', 'frank', 'gregory', 'raymond', 'alexander', 'patrick', 'jack', 'dennis', 'jerry', 'tyler',
    'aaron', 'jose', 'henry', 'adam', 'douglas', 'nathan', 'zachary', 'peter', 'kyle', 'noah',
    'alan', 'ethan', 'wayne', 'jordan', 'harold', 'dylan', 'sean', 'billy', 'jesse', 'ralph'
  ];
  
  // Seeds that tend to produce more feminine appearances
  const femaleSeeds = [
    'emily', 'sarah', 'jessica', 'jennifer', 'amanda', 'lisa', 'michelle', 'melissa', 'ashley', 'nicole',
    'stephanie', 'elizabeth', 'heather', 'kimberly', 'amy', 'angela', 'rebecca', 'samantha', 'megan', 'rachel',
    'christina', 'kelly', 'lauren', 'maria', 'katherine', 'andrea', 'julie', 'sarah', 'sara', 'karen',
    'nancy', 'betty', 'helen', 'sandra', 'donna', 'carol', 'ruth', 'sharon', 'michelle', 'laura',
    'emily', 'kimberly', 'deborah', 'dorothy', 'lisa', 'nancy', 'karen', 'betty', 'helen', 'sandra',
    'donna', 'carol', 'ruth', 'sharon', 'michelle', 'laura', 'sarah', 'kimberly', 'deborah', 'dorothy',
    'anna', 'sophia', 'olivia', 'isabella', 'emma', 'charlotte', 'amelia', 'mia', 'harper', 'evelyn'
  ];
  
  const catalog = [];

  // Generate male avatars - use first 70 seeds
  styles.forEach((style, styleIndex) => {
    for (let i = 0; i < 10; i++) {
      const seedIndex = (styleIndex * 10) + i;
      const seed = maleSeeds[seedIndex % maleSeeds.length];
      catalog.push({
        id: `dicebear-${style}-male-${i}`,
        label: `${style.charAt(0).toUpperCase() + style.slice(1)} ${i + 1}`,
        value: `male-${seed}-${styleIndex}-${i}`,
        type: 'dicebear',
        style: style,
        seed: seed,
        isDiceBear: true,
      });
    }
  });

  // Generate female avatars - use first 70 seeds
  styles.forEach((style, styleIndex) => {
    for (let i = 0; i < 10; i++) {
      const seedIndex = (styleIndex * 10) + i;
      const seed = femaleSeeds[seedIndex % femaleSeeds.length];
      catalog.push({
        id: `dicebear-${style}-female-${i}`,
        label: `${style.charAt(0).toUpperCase() + style.slice(1)} ${i + 11}`,
        value: `female-${seed}-${styleIndex}-${i}`,
        type: 'dicebear',
        style: style,
        seed: seed,
        isDiceBear: true,
      });
    }
  });

  return catalog;
};

const AVATAR_CATALOG = [
  // DiceBear avatars
  ...generateDiceBearCatalog(),

  // Emoji-style avatars
  { id: 'emoji-1', label: 'Rocket', value: '🚀', type: 'emoji' },
  { id: 'emoji-2', label: 'Robot', value: '🤖', type: 'emoji' },
  { id: 'emoji-3', label: 'Spark', value: '✨', type: 'emoji' },
  { id: 'emoji-4', label: 'Star', value: '⭐', type: 'emoji' },
  { id: 'emoji-5', label: 'Fire', value: '🔥', type: 'emoji' },

  // Initials-based
  { id: 'init-1', label: 'AT', value: 'AT', type: 'initials' },
  { id: 'init-2', label: 'PS', value: 'PS', type: 'initials' },
  { id: 'init-3', label: 'JD', value: 'JD', type: 'initials' },
  { id: 'init-4', label: 'SM', value: 'SM', type: 'initials' },
];



const Settingintro = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('AT');
  const [loading, setLoading] = useState(true);
  const [avatarFilter, setAvatarFilter] = useState('all');
  const [avatarSearch, setAvatarSearch] = useState('');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    website: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const tabs = ['Profile'];

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

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getProfile();
        console.log('Profile data received:', data);
        setProfileData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          bio: data.bio || '',
          website: data.website || ''
        });
        setSelectedAvatar(data.avatar || 'AT');
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Show user-friendly error message
        alert('Failed to load profile. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const updated = await api.updateProfile(profileData);
      setProfileData({
        firstName: updated.firstName || '',
        lastName: updated.lastName || '',
        email: updated.email || '',
        bio: updated.bio || '',
        website: updated.website || ''
      });
      console.log('Profile updated successfully:', updated);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleUpdatePassword = async () => {
    // Validate passwords
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New password and confirm password do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }

    try {
      await api.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });
      
      // Clear password fields on success
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      alert('Password changed successfully!');
      console.log('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      const errorMessage = error.message || 'Failed to update password. Please try again.';
      alert(errorMessage);
    }
  };

  const filteredAvatars = useMemo(() => {
    const normalizedQuery = avatarSearch.trim().toLowerCase();

    return AVATAR_CATALOG.filter((option) => {
      const matchesFilter =
        avatarFilter === 'all'
          ? true
          : option.type === avatarFilter;
      const matchesSearch =
        !normalizedQuery ||
        option.label.toLowerCase().includes(normalizedQuery) ||
        (typeof option.value === 'string' &&
          option.value.toLowerCase().includes(normalizedQuery)) ||
        option.type.toLowerCase().includes(normalizedQuery) ||
        (option.style && option.style.toLowerCase().includes(normalizedQuery));

      return matchesFilter && matchesSearch;
    });
  }, [avatarFilter, avatarSearch]);

  const openAvatarModal = () => setIsAvatarModalOpen(true);
  const closeAvatarModal = () => {
    setIsAvatarModalOpen(false);
    setAvatarSearch('');
    setAvatarFilter('all');
  };
  const saveAvatar = async () => {
    try {
      await api.updateProfile({ ...profileData, avatar: selectedAvatar });
      alert('Avatar updated successfully!');
    } catch (error) {
      console.error('Error updating avatar:', error);
      alert('Failed to update avatar. Please try again.');
    }
    closeAvatarModal();
  };

  if (loading) {
    return (
      <div className="settings-container" style={{ textAlign: 'center', padding: '40px' }}>
        <p>Loading profile...</p>
      </div>
    );
  }

  // Get the selected avatar option to determine its type
  const getSelectedAvatarOption = () => {
    return AVATAR_CATALOG.find(opt => opt.value === selectedAvatar);
  };

  // Render the main avatar display
  const renderMainAvatar = () => {
    // Check if selectedAvatar is a URL (starts with http)
    if (selectedAvatar && (selectedAvatar.startsWith('http://') || selectedAvatar.startsWith('https://'))) {
      return (
        <div className="avatar">
          <img 
            src={selectedAvatar} 
            alt="Avatar" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }}
            onError={(e) => {
              // Fallback if URL fails
              e.target.style.display = 'none';
              const fallback = e.target.parentElement.querySelector('.avatar-fallback');
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div className="avatar-fallback" style={{ display: 'none', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <div className="avatar-initials">??</div>
          </div>
        </div>
      );
    }

    const selectedOption = getSelectedAvatarOption();
    
    // Handle DiceBear avatars (identified via isDiceBear flag regardless of filter)
    if (selectedOption?.isDiceBear) {
      const avatarSrc = generateDiceBearAvatar(
        selectedOption.seed || selectedAvatar,
        selectedOption.style || 'adventurer',
        140
      );
      return (
        <div className="avatar">
          <img 
            src={avatarSrc} 
            alt="Avatar" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }}
            onError={(e) => {
              e.target.style.display = 'none';
              const fallback = e.target.parentElement.querySelector('.avatar-fallback');
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div className="avatar-fallback" style={{ display: 'none', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <div className="avatar-initials">??</div>
          </div>
        </div>
      );
    }

    const avatarSrc = getAvatarSource(selectedAvatar, selectedOption?.type, selectedOption?.style);

    if (selectedOption?.type === 'initials') {
      const colors = getInitialsColors(selectedAvatar);
      return (
        <div 
          className="avatar"
          style={{
            background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
          }}
        >
          <div className="avatar-initials">{selectedAvatar}</div>
        </div>
      );
    }

    if (selectedOption?.type === 'emoji') {
      return (
        <div className="avatar" style={{ fontSize: '64px' }}>
          {selectedAvatar}
        </div>
      );
    }

    if (avatarSrc) {
      return (
        <div className="avatar">
          <img 
            src={avatarSrc} 
            alt="Avatar" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }}
            onError={(e) => {
              e.target.style.display = 'none';
              const fallback = e.target.parentElement.querySelector('.avatar-fallback');
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div className="avatar-fallback" style={{ display: 'none', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <div className="avatar-initials">??</div>
          </div>
        </div>
      );
    }

    // Fallback
    return (
      <div className="avatar">
        <div className="avatar-initials">??</div>
      </div>
    );
  };

  const renderProfileTab = () => (
    <div className="profile-tab">
      <div className="profile-header">
        <h2>Profile Information</h2>
        <p>Update your personal information and profile settings</p>
      </div>

      <div className="avatar-section">
        <div className="avatar-container">
          {renderMainAvatar()}

          <div className="avatar-actions">
            <button className="change-avatar-btn" onClick={openAvatarModal}>Change Avatar</button>
            <p className="avatar-hint">Choose from our collection or use your own image URL</p>
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
            readOnly
            className="form-input"
            style={{ background: '#f5f5f5', cursor: 'not-allowed' }}
            title="Email cannot be changed"
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

        <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
          <button className="save-btn" onClick={handleSaveProfile}>
            Save Changes
          </button>
          <button 
            className="logout-btn"
            onClick={() => {
              logout();
              navigate('/auth');
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  const _renderPasswordTab = () => (
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
              <div className="avatar-filter-bar">
                <div className="avatar-search">
                  <input
                    type="search"
                    value={avatarSearch}
                    onChange={(event) => setAvatarSearch(event.target.value)}
                    placeholder="Search by vibe, role, or keyword..."
                    aria-label="Search avatars"
                  />
                </div>
                <div className="avatar-url-input">
                  <input
                    type="url"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    placeholder="Or paste an image URL here..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && customAvatarUrl) {
                        setSelectedAvatar(customAvatarUrl);
                        setCustomAvatarUrl('');
                      }
                    }}
                  />
                  {customAvatarUrl && (
                    <button
                      type="button"
                      className="primary-btn avatar-url-btn"
                      onClick={() => {
                        if (customAvatarUrl) {
                          setSelectedAvatar(customAvatarUrl);
                          setCustomAvatarUrl('');
                        }
                      }}
                    >
                      Use This URL
                    </button>
                  )}
                </div>
                <div className="avatar-filters" role="tablist" aria-label="Avatar categories">
                  {AVATAR_FILTERS.map((filter) => (
                    <button
                      key={filter.key}
                      type="button"
                      className={`avatar-filter-btn ${avatarFilter === filter.key ? 'active' : ''}`}
                      onClick={() => setAvatarFilter(filter.key)}
                      aria-pressed={avatarFilter === filter.key}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredAvatars.length > 0 ? (
                <div className="avatar-grid">
                  {filteredAvatars.map((option) => {
                    // Check if option.value is a URL
                    const isUrl = option.value && (option.value.startsWith('http://') || option.value.startsWith('https://'));
                    let avatarSrc;
                    
                    // Handle DiceBear avatars (identified via isDiceBear flag)
                    if (option.isDiceBear) {
                      avatarSrc = generateDiceBearAvatar(
                        option.seed || option.value,
                        option.style || 'adventurer',
                        80
                      );
                    } else {
                      avatarSrc = isUrl ? option.value : getAvatarSource(option.value, option.type, option.style);
                    }
                    
                    const colors = option.type === 'initials' ? getInitialsColors(option.value) : null;

                    return (
                      <button
                        key={option.id}
                        className={`avatar-option ${selectedAvatar === option.value ? 'selected' : ''}`}
                        onClick={() => setSelectedAvatar(option.value)}
                        aria-label={`Select avatar ${option.label}`}
                        title={option.label}
                        style={
                          option.type === 'initials' && colors
                            ? {
                                background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                              }
                            : {}
                        }
                      >
                        {option.type === 'emoji' ? (
                          <span style={{ fontSize: '2rem' }}>{option.value}</span>
                        ) : option.type === 'initials' ? (
                          <div className="avatar-initials" style={{ color: 'white', fontWeight: 700 }}>
                            {option.value}
                          </div>
                        ) : avatarSrc ? (
                          <img 
                            src={avatarSrc} 
                            alt={option.label}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              // Fallback if image fails to load
                              e.target.style.display = 'none';
                              const fallback = e.target.parentElement.querySelector('.avatar-option-fallback');
                              if (fallback) {
                                fallback.style.display = 'flex';
                              } else {
                                const fallbackDiv = document.createElement('div');
                                fallbackDiv.className = 'avatar-option-fallback';
                                fallbackDiv.style.cssText = 'display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;';
                                fallbackDiv.innerHTML = '<div class="avatar-initials" style="color: white; font-weight: 700; font-size: 24px;">??</div>';
                                e.target.parentElement.appendChild(fallbackDiv);
                              }
                            }}
                          />
                        ) : (
                          <div className="avatar-initials" style={{ color: 'white', fontWeight: 700 }}>
                            ??
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="avatar-empty-state">
                  <h4>No avatars match your filters</h4>
                  <p>Try a different keyword or reset your filters.</p>
                  <button
                    type="button"
                    className="avatar-filter-reset"
                    onClick={() => {
                      setAvatarFilter('all');
                      setAvatarSearch('');
                    }}
                  >
                    Reset filters
                  </button>
                </div>
              )}
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
