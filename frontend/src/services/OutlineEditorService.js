const API_BASE_URL = '/api/presentation';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

/**
 * Finalize presentation from outline
 * @param {Object} outlineData - The outline data to finalize
 * @returns {Promise<Object>} - Finalized presentation data
 */
export const finalizePresentation = async (outlineData) => {
  const response = await fetch(`${API_BASE_URL}/finalize`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(outlineData)
  });
  if (!response.ok) throw new Error(`Failed to finalize presentation: ${response.status}`);
  return response.json();
};

