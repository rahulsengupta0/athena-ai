// src/components/canva/TextEnhanceService.js
// Service for handling AI text enhancement API calls

const API_ENDPOINT = 'http://localhost:5000/api/text-enhance/enhance';

/**
 * Enhance text using AI
 * @param {string} text - The text to enhance
 * @param {boolean} isHeading - Whether the text is a heading
 * @returns {Promise<Object>} - Promise resolving to { enhancedText: string }
 */
export const enhanceText = async (text, isHeading = false) => {
  if (!text || !text.trim()) {
    throw new Error('Text is required');
  }

  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: text,
      isHeading: isHeading
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to enhance text');
  }

  const data = await response.json();
  
  if (!data.enhancedText) {
    throw new Error('No enhanced text received');
  }

  return data;
};

