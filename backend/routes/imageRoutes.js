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
  try {
    const imageResponse = await query({
      response_format: "b64_json",
      prompt: prompt,
      model: "stabilityai/stable-diffusion-xl-base-1.0",
    }, process.env.HUGGINGFACE_API_KEY);

    console.log('Image API Response:', imageResponse);  // <-- logs backend response
    res.json(imageResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
