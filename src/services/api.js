const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

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
      // console.log('Request headers:', config.headers); // Optional debug
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
        throw new Error((data && data.msg) || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ============= PROFILE API METHODS =============
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
      headers: getAuthHeaders(),
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

  async toggleFavorite({ itemId, type, favorite }) {
    return this.request('/api/user-data/favorites/toggle', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ itemId, type, favorite }),
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

  // ============= AUTH METHODS =============
  async verifyToken(token) {
    return this.request('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
  }

  // ============= TEMPLATE MANAGEMENT (ADMIN & USER) =============

  // 1. Upload Thumbnail Image
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

  // 2. Upload Background Image
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

  // 3. Upload JSON & Save Metadata (Unified Endpoint)
  async uploadTemplateJSON(templateData) {
    // This endpoint now handles both S3 upload of JSON and MongoDB metadata creation
    return this.request('/api/templates/upload-template-json', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(templateData),
    });
  }

  // 4. Save Metadata (Deprecated alias: points to uploadTemplateJSON for compatibility)
  async saveTemplateMetadata(data) {
    // If you have logic that separates saving metadata, you can handle it here,
    // but the new backend route handles it within uploadTemplateJSON.
    // We return the data directly as if it was a separate successful call.
    return Promise.resolve(data);
  }

  // 5. Get Templates (All or Filtered by Category)
  async getTemplates(category = '') {
    // If category is provided, append as query param
    const endpoint = category
      ? `/api/templates?category=${encodeURIComponent(category)}`
      : '/api/templates';

    return this.request(endpoint, {
      headers: getAuthHeaders(),
    });
  }

  // 6. Get Templates by Category (Explicit Helper)
  async getTemplatesByCategory(categoryName) {
    return this.getTemplates(categoryName);
  }

  // 7. Get Single Template Metadata by ID
  async getTemplateById(id) {
    return this.request(`/api/templates/${id}`, {
      headers: getAuthHeaders(),
    });
  }
  

  async deleteTemplate(id) {
    return this.request(`/api/templates/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  }

  // 8. Fetch JSON Content from S3 URL
  async fetchTemplateJSON(jsonUrl) {
    // This is a direct fetch to S3 (or signed URL), so we might not need auth headers
    // depending on bucket policy. Using standard fetch here.
    try {
      const response = await fetch(jsonUrl);
      if (!response.ok) throw new Error('Failed to load template design');
      return await response.json();
    } catch (error) {
      console.error('Error fetching template JSON:', error);
      throw error;
    }
  }
}

export default new ApiService();