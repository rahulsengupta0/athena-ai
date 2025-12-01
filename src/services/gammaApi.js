// Gamma API integration service
const GAMMA_API_BASE_URL = 'https://gamma.app/api';
const GAMMA_API_KEY = import.meta.env.VITE_GAMMA_API_KEY || 'your-gamma-api-key';

/**
 * Generate a presentation using Gamma API
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
    const response = await fetch(`${GAMMA_API_BASE_URL}/presentations/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GAMMA_API_KEY}`,
        'X-API-Key': GAMMA_API_KEY
      },
      body: JSON.stringify({
        prompt: params.prompt,
        options: {
          tone: params.tone,
          length: parseInt(params.length),
          media_style: params.mediaStyle,
          use_brand_style: params.useBrandStyle,
          outline: params.outlineText
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gamma API error: ${response.status}`);
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
    const response = await fetch(`${GAMMA_API_BASE_URL}/presentations/${presentationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GAMMA_API_KEY}`,
        'X-API-Key': GAMMA_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Gamma API error: ${response.status}`);
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
    const response = await fetch(`${GAMMA_API_BASE_URL}/presentations/${presentationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GAMMA_API_KEY}`,
        'X-API-Key': GAMMA_API_KEY
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error(`Gamma API error: ${response.status}`);
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
    const response = await fetch(`${GAMMA_API_BASE_URL}/presentations/${presentationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${GAMMA_API_KEY}`,
        'X-API-Key': GAMMA_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Gamma API error: ${response.status}`);
    }

    return true;
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
    const response = await fetch(`${GAMMA_API_BASE_URL}/presentations`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GAMMA_API_KEY}`,
        'X-API-Key': GAMMA_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Gamma API error: ${response.status}`);
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
    const response = await fetch(`${GAMMA_API_BASE_URL}/presentations/${presentationId}/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GAMMA_API_KEY}`,
        'X-API-Key': GAMMA_API_KEY
      },
      body: JSON.stringify({ format })
    });

    if (!response.ok) {
      throw new Error(`Gamma API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error exporting presentation:', error);
    throw error;
  }
};

