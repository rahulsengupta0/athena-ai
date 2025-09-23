const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Profile API methods
  async getProfile() {
    return this.request('/api/profile');
  }

  async updateProfile(profileData) {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(profileData).forEach(key => {
      if (key !== 'avatar' && profileData[key] !== null) {
        formData.append(key, profileData[key]);
      }
    });

    // Add avatar file if present
    if (profileData.avatar instanceof File) {
      formData.append('avatar', profileData.avatar);
    }

    return this.request('/api/profile', {
      method: 'PUT',
      headers: {}, // Remove Content-Type header to let browser set it for FormData
      body: formData,
    });
  }

  // Password API methods
  async changePassword(passwordData) {
    return this.request('/api/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  // Initialize default user (for demo purposes)
  async initUser() {
    return this.request('/api/init-user', {
      method: 'POST',
    });
  }
}

export default new ApiService();

