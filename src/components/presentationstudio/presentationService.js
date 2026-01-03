// Frontend service for Presentation Studio that communicates with our backend
const API_BASE_URL = '/api/pp';

/**
 * Generate a presentation using our backend proxy
 * @param {Object} params - Presentation generation parameters
 * @param {string} params.prompt - The topic or description for the presentation
 * @param {string} params.tone - The tone of the presentation (Professional, Friendly, etc.)
 * @param {string} params.length - Number of slides
 * @param {string} params.mediaStyle - Style of media to include (AI Graphics, Stock Images, None)
 * @param {boolean} params.useBrandStyle - Whether to use brand styling
 * @param {string} params.outlineText - Optional outline text
 * @returns {Promise<Object>} Generated presentation data
 */
export const generatePresentation = async (params) => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating presentation:', error);
    throw error;
  }
};

/**
 * Get presentation details by ID
 * @param {string} presentationId - The ID of the presentation
 * @returns {Promise<Object>} Presentation data
 */
export const getPresentation = async (presentationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${presentationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching presentation:', error);
    throw error;
  }
};

/**
 * Update presentation content
 * @param {string} presentationId - The ID of the presentation
 * @param {Object} updates - The updates to apply
 * @returns {Promise<Object>} Updated presentation data
 */
export const updatePresentation = async (presentationId, updates) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${presentationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating presentation:', error);
    throw error;
  }
};

/**
 * Delete a presentation
 * @param {string} presentationId - The ID of the presentation to delete
 * @returns {Promise<boolean>} Success status
 */
export const deletePresentation = async (presentationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${presentationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error deleting presentation:', error);
    throw error;
  }
};

/**
 * List user's presentations
 * @returns {Promise<Array>} List of presentations
 */
export const listPresentations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.presentations || [];
  } catch (error) {
    console.error('Error listing presentations:', error);
    throw error;
  }
};

/**
 * Export presentation to various formats
 * @param {string} presentationId - The ID of the presentation
 * @param {string} format - Export format (pptx, pdf, etc.)
 * @returns {Promise<Object>} Export information
 */
export const exportPresentation = async (presentationId, format) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${presentationId}/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ format })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error exporting presentation:', error);
    throw error;
  }
};