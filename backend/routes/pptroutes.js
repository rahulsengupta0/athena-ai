const express = require('express');
const axios = require('axios');
const router = express.Router();

// Gamma API configuration
const GAMMA_API_BASE_URL = 'https://public-api.gamma.app/v1.0';
const GAMMA_API_KEY = process.env.GAMMA_API_KEY;

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
    
    // Validate parameters
    const validLength = parseInt(length);
    if (isNaN(validLength) || validLength < 1 || validLength > 60) {
      return res.status(400).json({ error: 'Length must be a number between 1 and 60' });
    }
    
    // Validate tone
    const validTones = ['professional', 'friendly', 'minimal', 'corporate', 'creative'];
    const normalizedTone = tone.toLowerCase();
    if (!validTones.includes(normalizedTone)) {
      return res.status(400).json({ error: `Invalid tone. Must be one of: ${validTones.join(', ')}` });
    }
    
    // Validate mediaStyle
    const validMediaStyles = ['AI Graphics', 'Stock Images', 'None'];
    if (!validMediaStyles.includes(mediaStyle)) {
      return res.status(400).json({ error: `Invalid media style. Must be one of: ${validMediaStyles.join(', ')}` });
    }

    // Prepare the request payload
    const payload = {
      inputText: prompt,
      textMode: 'generate',
      format: 'presentation',
      numCards: parseInt(length),
      textOptions: {
        tone: tone.toLowerCase(),
      },
      imageOptions: {
        source: mediaStyle === 'AI Graphics' ? 'aiGenerated' : mediaStyle === 'Stock Images' ? 'stock' : 'noImages'
      },
      additionalInstructions: outlineText || ''
    };
    
    // Log the request for debugging
    console.log('Sending request to Gamma API:', {
      url: `${GAMMA_API_BASE_URL}/generations`,
      payload: payload,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': GAMMA_API_KEY.substring(0, 10) + '...' // Log only first 10 chars for security
      }
    });
    
    const response = await axios.post(`${GAMMA_API_BASE_URL}/generations`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': GAMMA_API_KEY
      }
    });
    try {
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      
      const generatedResponse = await axios.get(`${GAMMA_API_BASE_URL}/generations/${response.data.generationId}`, {
        headers: {
          'X-API-Key': GAMMA_API_KEY
        }
      });
      
      // Log the actual response for debugging
      console.log('Gamma API response structure:', JSON.stringify(generatedResponse.data, null, 2));
      
      // Try to extract slides from different possible structures
      let slides = [];
      if (Array.isArray(generatedResponse.data)) {
        slides = generatedResponse.data;
      } else if (generatedResponse.data.cards) {
        slides = generatedResponse.data.cards;
      } else if (generatedResponse.data.slides) {
        slides = generatedResponse.data.slides;
      } else if (generatedResponse.data.presentation && generatedResponse.data.presentation.pages) {
        slides = generatedResponse.data.presentation.pages;
      } else if (generatedResponse.data.presentation && Array.isArray(generatedResponse.data.presentation)) {
        slides = generatedResponse.data.presentation;
      }
      
      return res.json({
        generationId: response.data.generationId,
        status: generatedResponse.data.status || 'completed',
        slides: slides,
        presentation: generatedResponse.data.presentation || generatedResponse.data
      });
    } catch (fetchError) {
     
      console.warn('Could not fetch generated content immediately:', fetchError.message);
      return res.json({
        generationId: response.data.generationId,
        status: 'pending'
      });
    }
  } catch (error) {
    console.error('Error generating presentation:', error.response?.data || error.message);
    
    
    console.error('Detailed error info:', {
      message: error.message,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      } : null,
      request: error.request ? 'Request was made but no response received' : 'No request made'
    });
    
    
    let errorMessage = 'Unknown error occurred';
    let errorStatus = 500;
    
    if (error.response) {
      
      errorStatus = error.response.status;
      if (error.response.data && typeof error.response.data === 'object') {
        errorMessage = error.response.data.message || error.response.data.error || JSON.stringify(error.response.data);
      } else {
        errorMessage = error.response.data || `HTTP ${errorStatus}: ${error.response.statusText}`;
      }
    } else if (error.request) {
      
      errorMessage = 'No response received from Gamma API. Please check your network connection and API key.';
    } else {
      
      errorMessage = error.message;
    }
    
    return res.status(errorStatus).json({ 
      error: errorMessage,
      status: errorStatus,
      timestamp: new Date().toISOString()
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
    
    const response = await axios.get(`${GAMMA_API_BASE_URL}/generations/${id}`, {
      headers: {
        'X-API-Key': GAMMA_API_KEY
      }
    });

    return res.json(response.data);
  } catch (error) {
    console.error('Error fetching presentation:', error.response?.data || error.message);
    
    const errorMessage = error.response?.data || error.message || 'Unknown error occurred';
    const errorStatus = error.response?.status || 500;
    return res.status(errorStatus).json({ 
      error: errorMessage,
      status: errorStatus,
      timestamp: new Date().toISOString()
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
    
    const response = await axios.put(`${GAMMA_API_BASE_URL}/generations/${id}`, updates, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': GAMMA_API_KEY
      }
    });

    return res.json(response.data);
  } catch (error) {
    console.error('Error updating presentation:', error.response?.data || error.message);
    const errorMessage = error.response?.data || error.message || 'Unknown error occurred';
    const errorStatus = error.response?.status || 500;
    return res.status(errorStatus).json({ 
      error: errorMessage,
      status: errorStatus,
      timestamp: new Date().toISOString()
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
    
    await axios.delete(`${GAMMA_API_BASE_URL}/generations/${id}`, {
      headers: {
        'X-API-Key': GAMMA_API_KEY
      }
    });

    return res.json({ success: true });
  } catch (error) {
    console.error('Error deleting presentation:', error.response?.data || error.message);
    const errorMessage = error.response?.data || error.message || 'Unknown error occurred';
    const errorStatus = error.response?.status || 500;
    return res.status(errorStatus).json({ 
      error: errorMessage,
      status: errorStatus,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * List user's presentations
 * @returns {Promise<Array>} List of presentations
 */
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${GAMMA_API_BASE_URL}/generations`, {
      headers: {
        'X-API-Key': GAMMA_API_KEY
      }
    });

    return res.json({
      presentations: response.data.presentations || []
    });
  } catch (error) {
    console.error('Error listing presentations:', error.response?.data || error.message);
    
    const errorMessage = error.response?.data || error.message || 'Unknown error occurred';
    const errorStatus = error.response?.status || 500;
    return res.status(errorStatus).json({ 
      error: errorMessage,
      status: errorStatus,
      timestamp: new Date().toISOString()
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
    
    // Call Gamma API to export the presentation
    const response = await axios.post(`${GAMMA_API_BASE_URL}/generations/${id}/export`, {
      format: format
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': GAMMA_API_KEY
      }
    });
    
    return res.json(response.data);
  } catch (error) {
    console.error('Error exporting presentation:', error.response?.data || error.message);
    // Provide more detailed error information
    const errorMessage = error.response?.data || error.message || 'Unknown error occurred';
    const errorStatus = error.response?.status || 500;
    return res.status(errorStatus).json({ 
      error: errorMessage,
      status: errorStatus,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Rewrite content with AI
 * @param {Object} req.body - Rewrite parameters
 * @returns {Promise<Object>} Rewritten content
 */
router.post('/rewrite', async (req, res) => {
  try {
    const { content, instruction } = req.body;
    
    // For now, we'll simulate AI rewriting
    // In a real implementation, this would call an AI service
    let rewrittenContent = content;
    
    switch(instruction) {
      case 'simplify':
        rewrittenContent = content.split('\n')
          .filter(line => line.trim() !== '')
          .map(line => `• ${line}`)
          .join('\n');
        break;
      case 'expand':
        rewrittenContent = `${content}

Key Insights:
• Additional insight 1
• Additional insight 2
• Additional insight 3`;
        break;
      case 'persuasive':
        rewrittenContent = `Compelling ${content.toLowerCase()} that drives action and engagement`;
        break;
    }
    
    return res.json({ 
      rewrittenContent: rewrittenContent
    });
  } catch (error) {
    console.error('Error rewriting content:', error.message);
    const errorMessage = error.message || 'Unknown error occurred';
    const errorStatus = 500;
    return res.status(errorStatus).json({ 
      error: errorMessage,
      status: errorStatus,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Generate AI image
 * @param {Object} req.body - Image generation parameters
 * @returns {Promise<Object>} Generated image URL
 */
router.post('/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // For now, we'll return a placeholder image
    // In a real implementation, this would call an AI image generation service
    const imageUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80';
    
    return res.json({ 
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error('Error generating image:', error.message);
    const errorMessage = error.message || 'Unknown error occurred';
    const errorStatus = 500;
    return res.status(errorStatus).json({ 
      error: errorMessage,
      status: errorStatus,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Save presentation
 * @param {Object} req.body - Presentation data
 * @returns {Promise<Object>} Saved presentation ID
 */
router.post('/save', async (req, res) => {
  try {
    const { slides } = req.body;
    
    // For now, we'll just return a mock ID
    // In a real implementation, this would save to a database
    const presentationId = `pres_${Date.now()}`;
    
    return res.json({ 
      id: presentationId,
      message: 'Presentation saved successfully'
    });
  } catch (error) {
    console.error('Error saving presentation:', error.message);
    const errorMessage = error.message || 'Unknown error occurred';
    const errorStatus = 500;
    return res.status(errorStatus).json({ 
      error: errorMessage,
      status: errorStatus,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Share presentation
 * @param {Object} req.body - Presentation data
 * @returns {Promise<Object>} Shareable URL
 */
router.post('/share', async (req, res) => {
  try {
    const { slides } = req.body;
    
    // For now, we'll just return a mock URL
    // In a real implementation, this would create a shareable link
    const shareUrl = `https://athena-ai.presentation/${Date.now()}`;
    
    return res.json({ 
      shareUrl: shareUrl
    });
  } catch (error) {
    console.error('Error sharing presentation:', error.message);
    const errorMessage = error.message || 'Unknown error occurred';
    const errorStatus = 500;
    return res.status(errorStatus).json({ 
      error: errorMessage,
      status: errorStatus,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;