const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai'); // Add this import
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs').promises;
const path = require('path');

// Initialize multer for file uploads
const uploadMiddleware = upload.single('file');

async function query(prompt, apiKey) {
  const openai = new OpenAI({ apiKey });
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: 1,
    size: "1024x1024",
    response_format: "b64_json"
  });
  return response;
}

router.post('/generate-image', async (req, res) => {
  const prompt = req.body.prompt;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY is not configured on the server' });
  }
  try {
    const imageResponse = await query(prompt, apiKey);
    res.json(imageResponse); // OpenAI's response format matches frontend expectations
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Background removal endpoint
router.post('/remove-bg', uploadMiddleware, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const filePath = req.file.path;
    
    // Read the original image file
    const imageBuffer = await fs.readFile(filePath);
    
    // Check if REMOVE_BG_API_KEY is configured
    const removeBgApiKey = process.env.REMOVE_BG_API_KEY;
    if (!removeBgApiKey) {
      console.log('REMOVE_BG_API_KEY not configured, returning original image');
      // If no API key, return the original image
      res.set('Content-Type', 'image/png');
      res.set('Content-Disposition', 'attachment; filename="bg-removed.png"');
      res.send(imageBuffer);
      await fs.unlink(filePath);
      return;
    }
    
    // Use remove.bg API to remove background
    const FormData = require('form-data');
    const axios = require('axios');
    
    const formData = new FormData();
    formData.append('image_file', imageBuffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    
    try {
      const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
        headers: {
          ...formData.getHeaders(),
          'X-Api-Key': removeBgApiKey,
        },
        responseType: 'arraybuffer'
      });
      
      // Send the processed image back to the client
      res.set('Content-Type', 'image/png');
      res.set('Content-Disposition', 'attachment; filename="bg-removed.png"');
      res.send(response.data);
    } catch (apiError) {
      console.error('Background removal API error:', apiError.message);
      // If API fails, return the original image
      res.set('Content-Type', 'image/png');
      res.set('Content-Disposition', 'attachment; filename="bg-removed.png"');
      res.status(200).send(imageBuffer);
    }
    
    // Clean up uploaded file
    await fs.unlink(filePath);
  } catch (error) {
    console.error('Background removal error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
