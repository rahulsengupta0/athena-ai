const express = require('express');
const router = express.Router();
const { InferenceClient } = require("@huggingface/inference");

const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

router.post("/generate-video", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ msg: "Prompt is required" });

    const videoBlob = await client.textToVideo({
      provider: "fal-ai",
      model: "genmo/mochi-1-preview",
      inputs: prompt,
    });

    const buffer = Buffer.from(await videoBlob.arrayBuffer());

    res.json({
      videoBase64: buffer.toString("base64"),
      mimeType: "video/mp4",
    });
  } catch (error) {
    console.error("Video generation error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
