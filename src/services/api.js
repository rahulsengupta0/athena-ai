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

  // Project collaborators
  async addProjectCollaborator(projectId, userId) {
    return this.request(`/api/user-data/projects/${projectId}/collaborators`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId }),
    });
  }

  async removeProjectCollaborator(projectId, collabUserId) {
    return this.request(`/api/user-data/projects/${projectId}/collaborators/${collabUserId}`, {
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

  async getBrandKitFolders() {
    return this.request('/api/brandkit-list', {
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

  // Brand kit collaborators
  async addBrandKitCollaborator(brandKitId, userId) {
    return this.request(`/api/user-data/brandkits/${brandKitId}/collaborators`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId }),
    });
  }

  async removeBrandKitCollaborator(brandKitId, collabUserId) {
    return this.request(`/api/user-data/brandkits/${brandKitId}/collaborators/${collabUserId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  }

  async deleteBrandKitFolder(kitFolder) {
    // URL encode the kitFolder to handle special characters
    const encodedKitFolder = encodeURIComponent(kitFolder);
    return this.request(`/api/brandkit/${encodedKitFolder}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  }

  async addImageToBrandKit(kitFolder, imageUrl, category, fileName) {
    const encodedKitFolder = encodeURIComponent(kitFolder);
    return this.request(`/api/brandkit/${encodedKitFolder}/add-image`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ imageUrl, category, fileName }),
    });
  }

  async deleteImageFromBrandKit(kitFolder, fileName) {
    const encodedKitFolder = encodeURIComponent(kitFolder);
    const encodedFileName = encodeURIComponent(fileName);
    return this.request(`/api/brandkit/${encodedKitFolder}/image/${encodedFileName}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  }

  // ============= TEAM MANAGEMENT =============
  async getTeamMembers() {
    return this.request('/api/team/members', {
      headers: getAuthHeaders(),
    });
  }

  async getMemberProjects(memberId) {
    return this.request(`/api/team/members/${memberId}/projects`, {
      headers: getAuthHeaders(),
    });
  }

  async inviteTeamMember(email, role = 'member') {
    return this.request('/api/team/invite', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, role }),
    });
  }

  async getTeamInvites() {
    return this.request('/api/team/invites', {
      headers: getAuthHeaders(),
    });
  }

  async acceptInvite(token) {
    return this.request(`/api/team/invites/accept/${token}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  }

  async removeTeamMember(memberId) {
    return this.request(`/api/team/members/${memberId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  }

  async cancelInvite(inviteId) {
    return this.request(`/api/team/invites/${inviteId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  }

  async getTeamStats() {
    return this.request('/api/team/stats', {
      headers: getAuthHeaders(),
    });
  }

  // ============= TEMPLATE MANAGEMENT (ADMIN) =============
  async uploadTemplateThumbnail(file) {
    const formData = new FormData();
    formData.append('thumbnail', file);
    return this.request('/api/templates/upload-thumbnail', {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeaders().Authorization
      },
      body: formData,
    });
  }

  async uploadTemplateBackground(file) {
    const formData = new FormData();
    formData.append('background', file);
    return this.request('/api/templates/upload-background', {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeaders().Authorization
      },
      body: formData,
    });
  }

  async uploadTemplateJSON(templateData) {
    return this.request('/api/templates/upload-template-json', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(templateData),
    });
  }
}

export default new ApiService();

