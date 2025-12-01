const express = require('express');
const axios = require('axios');
const router = express.Router();

// Gamma API configuration
const GAMMA_API_BASE_URL = 'https://gamma.app/api';
const GAMMA_API_KEY = process.env.GAMMA_API_KEY || 'your-gamma-api-key';

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
router.post('/generate', async (req, res) => {
  try {
    const { prompt, tone, length, mediaStyle, useBrandStyle, outlineText } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await axios.post(`${GAMMA_API_BASE_URL}/presentations/generate`, {
      prompt,
      options: {
        tone,
        length: parseInt(length),
        media_style: mediaStyle,
        use_brand_style: useBrandStyle,
        outline: outlineText
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GAMMA_API_KEY}`,
        'X-API-Key': GAMMA_API_KEY
      }
    });

    return res.json(response.data);
  } catch (error) {
    console.error('Error generating presentation:', error.response?.data || error.message);
    return res.status(500).json({ 
      error: error.response?.data || error.message 
    });
  }
});

/**
 * Get presentation details by ID
 * @param {string} presentationId - The ID of the presentation
 * @returns {Promise<Object>} Presentation data
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await axios.get(`${GAMMA_API_BASE_URL}/presentations/${id}`, {
      headers: {
        'Authorization': `Bearer ${GAMMA_API_KEY}`,
        'X-API-Key': GAMMA_API_KEY
      }
    });

    return res.json(response.data);
  } catch (error) {
    console.error('Error fetching presentation:', error.response?.data || error.message);
    return res.status(500).json({ 
      error: error.response?.data || error.message 
    });
  }
});

/**
 * Update presentation content
 * @param {string} presentationId - The ID of the presentation
 * @param {Object} updates - The updates to apply
 * @returns {Promise<Object>} Updated presentation data
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const response = await axios.put(`${GAMMA_API_BASE_URL}/presentations/${id}`, updates, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GAMMA_API_KEY}`,
        'X-API-Key': GAMMA_API_KEY
      }
    });

    return res.json(response.data);
  } catch (error) {
    console.error('Error updating presentation:', error.response?.data || error.message);
    return res.status(500).json({ 
      error: error.response?.data || error.message 
    });
  }
});

/**
 * Delete a presentation
 * @param {string} presentationId - The ID of the presentation to delete
 * @returns {Promise<boolean>} Success status
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await axios.delete(`${GAMMA_API_BASE_URL}/presentations/${id}`, {
      headers: {
        'Authorization': `Bearer ${GAMMA_API_KEY}`,
        'X-API-Key': GAMMA_API_KEY
      }
    });

    return res.json({ success: true });
  } catch (error) {
    console.error('Error deleting presentation:', error.response?.data || error.message);
    return res.status(500).json({ 
      error: error.response?.data || error.message 
    });
  }
});

/**
 * List user's presentations
 * @returns {Promise<Array>} List of presentations
 */
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${GAMMA_API_BASE_URL}/presentations`, {
      headers: {
        'Authorization': `Bearer ${GAMMA_API_KEY}`,
        'X-API-Key': GAMMA_API_KEY
      }
    });

    return res.json({
      presentations: response.data.presentations || []
    });
  } catch (error) {
    console.error('Error listing presentations:', error.response?.data || error.message);
    return res.status(500).json({ 
      error: error.response?.data || error.message 
    });
  }
});

/**
 * Export presentation to various formats
 * @param {string} presentationId - The ID of the presentation
 * @param {string} format - Export format (pptx, pdf, etc.)
 * @returns {Promise<Object>} Export information
 */
router.post('/:id/export', async (req, res) => {
  try {
    const { id } = req.params;
    const { format } = req.body;
    
    const response = await axios.post(`${GAMMA_API_BASE_URL}/presentations/${id}/export`, {
      format
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GAMMA_API_KEY}`,
        'X-API-Key': GAMMA_API_KEY
      }
    });

    return res.json(response.data);
  } catch (error) {
    console.error('Error exporting presentation:', error.response?.data || error.message);
    return res.status(500).json({ 
      error: error.response?.data || error.message 
    });
  }
});

module.exports = router;