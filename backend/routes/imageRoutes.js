const express = require('express');
const router = express.Router();

async function query(data, apiKey) {
  const response = await fetch(
    "https://router.huggingface.co/nscale/v1/images/generations",
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();  // Expect JSON with base64 string
  return result;
}

router.post('/generate-image', async (req, res) => {
  const prompt = req.body.prompt;
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'HUGGINGFACE_API_KEY is not configured on the server' });
  }
  try {
    const imageResponse = await query({
      response_format: "b64_json",
      prompt,
      model: "stabilityai/stable-diffusion-xl-base-1.0",
    }, apiKey);

    if (imageResponse?.error) {
      return res.status(401).json({ error: imageResponse.error });
    }

    console.log('Image API Response:', imageResponse);
    res.json(imageResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
