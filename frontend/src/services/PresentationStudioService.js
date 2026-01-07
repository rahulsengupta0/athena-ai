const API_BASE_URL = '/api/pp';

/**
 * Generate presentation data from backend
 * @param {Object} params - Parameters for presentation generation
 * @param {string} params.prompt - Topic of the presentation
 * @returns {Promise<Object>} - Generated slides and theme
 */
export const generatePresentation = async (params) => {
  const response = await fetch(`${API_BASE_URL}/get-presentation-data`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      topic: params.prompt,
      tone: params.tone,
      length: params.length,
      mediaStyle: params.mediaStyle,
      useBrandStyle: params.useBrandStyle,
      outlineText: params.outlineText
    })
  });
  if (!response.ok) throw new Error(`Failed to generate presentation: ${response.status}`);
  return response.json();
};

/**
 * Export presentation as different formats
 * @param {Array} slides - Edited slides array
 * @param {string} format - Format, e.g., 'pptx', 'pdf'
 * @returns {Promise<Blob>} - Blob data for download
 */
export const exportPresentation = async (slides, theme, format) => {
  const response = await fetch(`${API_BASE_URL}/generate-ppt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: 'presentation', editedData: { slides, theme } })
  });
  if (!response.ok) throw new Error(`Failed to export presentation: ${response.status}`);
  return response.blob();
};

/**
 * Rewrite slide content using AI
 * @param {string} content - Original slide content
 * @param {string} instruction - Instruction for rewriting
 * @returns {Promise<Object>} - { rewrittenContent: string }
 */
export const rewriteContent = async (content, instruction) => {
  const response = await fetch(`${API_BASE_URL}/rewrite-slide`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, instruction })
  });
  if (!response.ok) throw new Error(`Failed to rewrite content: ${response.status}`);
  return response.json();
};

/**
 * Generate AI image for a slide
 * @param {string} prompt - Prompt for image generation
 * @returns {Promise<Object>} - { imageUrl: string }
 */
export const generateImage = async (prompt) => {
  const response = await fetch(`${API_BASE_URL}/generate-slide-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  if (!response.ok) throw new Error(`Failed to generate image: ${response.status}`);
  return response.json();
};