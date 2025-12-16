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
    const prompt = `
Create a clean, modern, Canva-style typography design for the text: "${text}".

STRICT RULES:
- The design must be TEXT ONLY.
- No icons, no symbols, no shapes, no decorations.
- No poster layout, no boxes, no UI panels, no labels.
- Background must be plain, minimal, and soft (or fully transparent).
- DO NOT stylize letters into objects.
- DO NOT apply heavy 3D, metallic, neon, bubble, or chrome effects.

STYLE:
- Use modern font pairings (bold + thin, serif + sans-serif, italic + regular).
- Use clean, flat typography.
- You may use:
  - subtle shadow,
  - subtle glow,
  - subtle gradient,
  - color contrast.
- Keep everything light, minimal, elegant.

TYPOGRAPHY RULES:
- Explore different layout ideas:
  - one word bold, one thin
  - stacked text
  - mixed-case styling
  - letter spacing variations
  - underline or accent lines (simple)
  - overlapping text (minimal)
  - italic + bold combination

GOAL:
Create a beautiful, modern, minimal typographic text design similar to Canva text templates—simple, readable, professional.
Generate only ONE style per image.
`;


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
