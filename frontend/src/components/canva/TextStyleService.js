// src/components/canva/TextStyleService.js
// Service for handling AI text styling API calls

const API_ENDPOINT = '/api/text-style/generate';

/**
 * Generate styled text designs using AI
 * @param {string} text - The text to style
 * @returns {Promise<Object>} - Promise resolving to { images: string[] }
 */
export const generateTextStyles = async (text) => {
  if (!text || !text.trim()) {
    throw new Error('Text is required');
  }

  const response = await fetch(`${API_ENDPOINT}?text=${encodeURIComponent(text)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to generate text styles');
  }

  const data = await response.json();
  
  if (!data.images || !Array.isArray(data.images)) {
    throw new Error('No images received');
  }

  return data;
};