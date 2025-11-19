const express = require('express');
const { OpenAI } = require('openai');
const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/generate', async (req, res) => {
  const { prompt, style, ratio, quality } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const combinedPrompt = style ? `${style} style: ${prompt}` : prompt;

    let size = '1024x1024';
    switch (ratio) {
      case '3:4':
        size = '1024x1366';
        break;
      case '4:3':
        size = '1366x1024';
        break;
      case '16:9':
        size = '1920x1080';
        break;
      default:
        size = '1024x1024';
    }

    // quality param not officially documented in openai images generate; omitting it
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: combinedPrompt,
      n: 1,
      size: size,
      response_format: 'b64_json',
    });

    const base64Image = response.data[0].b64_json;
    const imageUrl = `data:image/png;base64,${base64Image}`;

    return res.json({ imageUrl });
  } catch (error) {
    console.error('Image generation error:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
