const express = require('express');
const router = express.Router();
require('dotenv').config();

const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/generate-logo", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ msg: "Prompt is required" });

    // Request image generation from OpenAI with DALL-E 3
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json"
    });

    const imageBase64 = response.data?.[0]?.b64_json;

    if (!imageBase64) {
      return res.status(500).json({ error: "No image generated" });
    }

    res.json({
      imageBase64,
      mimeType: "image/png",
    });
  } catch (error) {
    console.error("Logo generation error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
