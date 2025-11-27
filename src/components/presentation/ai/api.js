const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const buildUrl = (path) => {
  if (API_BASE.endsWith('/') && path.startsWith('/')) {
    return `${API_BASE.slice(0, -1)}${path}`;
  }
  if (!API_BASE.endsWith('/') && !path.startsWith('/')) {
    return `${API_BASE}/${path}`;
  }
  return `${API_BASE}${path}`;
};

export const enhancePresentationText = async ({ text, isHeading = false }) => {
  if (!text || !text.trim()) {
    throw new Error('Text is required');
  }

  const response = await fetch(buildUrl('/api/text-enhance/enhance'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      isHeading,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to enhance text');
  }

  const data = await response.json();
  if (!data.enhancedText) {
    throw new Error('No enhanced text received');
  }

  return data.enhancedText;
};

export const generatePresentationImage = async (prompt) => {
  if (!prompt || !prompt.trim()) {
    throw new Error('Prompt is required to generate an image');
  }

  const response = await fetch(buildUrl('/api/image/generate-image'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate image');
  }

  const data = await response.json();
  const base64 = data?.data?.[0]?.b64_json;
  if (!base64) {
    throw new Error('Image generation did not return data');
  }

  return `data:image/png;base64,${base64}`;
};




