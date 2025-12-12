const express = require('express');
const OpenAI = require('openai');
const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Middleware to ensure all responses are JSON
router.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

router.get('/generate', async (req, res) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    // Create the prompt for generating stylized text
    const prompt = `Render the text: "${text}"

Create 6 artistic, stylized text designs. 
Each design should look like a logo / sticker.
Visual Requirements:
- PNG
- transparent background
- no surrounding box or border
- no extra objects unless part of style
- centered composition
- high contrast, sharp edges
- design must be readable`;

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }

    // Generate the images using DALL-E
    // DALL-E 3 only supports n=1, so we need to make 6 separate requests
    const promises = [];
    for (let i = 0; i < 6; i++) {
      promises.push(openai.images.generate({
        model: "dall-e-3",
        prompt,
        size: "1024x1024",
        n: 1,
        response_format: "url",
      }));
    }

    const responses = await Promise.all(promises);
    const urls = responses.map(response => response.data[0].url);
    return res.json({ images: urls });
  } catch (err) {
    console.error('Text style generation error:', err);
    // Ensure we always return a JSON response even in error cases
    return res.status(500).json({ error: 'Image generation failed' });
  }
});

// Global error handler for this router
router.use((err, req, res, next) => {
  console.error('Router error:', err);
  // Ensure we always return a JSON response
  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
