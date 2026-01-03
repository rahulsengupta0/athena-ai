import api from '../../../services/api';

export const enhancePresentationText = async ({ text, isHeading = false }) => {
  if (!text || !text.trim()) {
    throw new Error('Text is required');
  }

  const data = await api.request('/api/text-enhance/enhance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      isHeading,
    }),
  });

  if (!data.enhancedText) {
    throw new Error('No enhanced text received');
  }

  return data.enhancedText;
};

export const generatePresentationImage = async (prompt) => {
  if (!prompt || !prompt.trim()) {
    throw new Error('Prompt is required to generate an image');
  }

  const data = await api.request('/api/image/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  const base64 = data?.data?.[0]?.b64_json;
  if (!base64) {
    throw new Error('Image generation did not return data');
  }

  return `data:image/png;base64,${base64}`;
};






