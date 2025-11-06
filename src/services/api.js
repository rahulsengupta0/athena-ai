const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`Making request to: ${url}`);
      console.log('Request headers:', config.headers);
      const response = await fetch(url, config);
      const contentType = response.headers.get('content-type') || '';
      let data;
      if (response.status === 204) {
        data = null;
      } else if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        if (!response.ok) {
          console.error('Response error (text):', text);
          throw new Error(text || 'Something went wrong');
        }
        return text;
      }

      if (!response.ok) {
        console.error('Response error:', data);
        throw new Error((data && data.message) || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Profile API methods
  async getProfile() {
    return this.request('/api/profile', {
      headers: getAuthHeaders(),
    });
  }

  async updateProfile(profileData) {
    const { avatar, ...textData } = profileData;
    
    // If there's an avatar file, use FormData, otherwise use JSON
    if (avatar instanceof File) {
      const formData = new FormData();
      
      Object.keys(textData).forEach(key => {
        if (textData[key] !== null) {
          formData.append(key, textData[key]);
        }
      });
      formData.append('avatar', avatar);

      return this.request('/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': getAuthHeaders().Authorization
        },
        body: formData,
      });
    } else {
      return this.request('/api/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
      });
    }
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

  // ============= USER DATA API METHODS =============
  
  // Projects
  async getProjects() {
    return this.request('/api/user-data/projects', {
      headers: getAuthHeaders(),
    });
  }

  async createProject(projectData) {
    return this.request('/api/user-data/projects', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id, projectData) {
    return this.request(`/api/user-data/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(id) {
    return this.request(`/api/user-data/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  }

  // Favorites
  async getFavorites() {
    return this.request('/api/user-data/favorites', {
      headers: getAuthHeaders(),
    });
  }

  async createFavorite(favoriteData) {
    return this.request('/api/user-data/favorites', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(favoriteData),
    });
  }

  async deleteFavorite(id) {
    return this.request(`/api/user-data/favorites/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  }

  // ============= USER FILES (S3 uploads) =============
  async getUserFiles() {
    return this.request('/api/upload', {
      headers: getAuthHeaders(),
    });
  }

  async deleteUserFile(id) {
    return this.request(`/api/upload/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  }

  // ============= BRAND KITS =============
  async getBrandKits() {
    return this.request('/api/user-data/brandkits', {
      headers: getAuthHeaders(),
    });
  }

  async createBrandKit(brandKitData) {
    return this.request('/api/user-data/brandkits', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(brandKitData),
    });
  }

  async updateBrandKit(id, brandKitData) {
    return this.request(`/api/user-data/brandkits/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(brandKitData),
    });
  }

  async deleteBrandKit(id) {
    return this.request(`/api/user-data/brandkits/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  }
}

export default new ApiService();

