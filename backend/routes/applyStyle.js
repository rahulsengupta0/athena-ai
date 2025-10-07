const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer();

async function queryHuggingFace(prompt, base64Image, apiKey) {
  const bodyPayload = {
    inputs: prompt,
    options: { wait_for_model: true }
  };

  // if an image is provided, include it for image-to-image
  if (base64Image) {
    bodyPayload.image = base64Image;
  }

  const response = await fetch(
    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyPayload),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HF API Error: ${response.status} ${text}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer).toString('base64');
}

router.post('/apply-style', upload.single('file'), async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  // get uploaded file if exists
  let base64Image = null;
  if (req.file) {
    base64Image = req.file.buffer.toString('base64');
  }

  try {
    const resultBase64 = await queryHuggingFace(prompt, base64Image, process.env.HUGGINGFACE_API_KEY);
    res.json({ image: resultBase64 });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
