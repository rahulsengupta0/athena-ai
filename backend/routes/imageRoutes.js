const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai'); // Add this import

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

module.exports = router;
