const express = require('express');
const router = express.Router();

// Dynamic import of fetch for CommonJS compatibility
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

require('dotenv').config();

router.post("/generate-logo", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ msg: "Prompt is required" });

    const response = await fetch("https://router.huggingface.co/fal-ai/fal-ai/flux-lora", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sync_mode: true,
        prompt: prompt,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.json({
      imageBase64: buffer.toString("base64"),
      mimeType: "image/png",
    });
  } catch (error) {
    console.error("Logo generation error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
