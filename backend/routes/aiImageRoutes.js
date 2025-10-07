const express = require('express');
const { InferenceClient } = require('@huggingface/inference');
const router = express.Router();

const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);
router.post('/generate', async (req, res) => {
  const { prompt, style } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const combinedPrompt = style ? `${style} style: ${prompt}` : prompt;

    // Call HuggingFace API
    const imageBlob = await client.textToImage({
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      inputs: combinedPrompt,
    });

    // Convert Blob -> Buffer
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Encode to base64
    const base64Image = buffer.toString('base64');
    const imageUrl = `data:image/png;base64,${base64Image}`;

    return res.json({ imageUrl });
  } catch (error) {
    console.error('Image generation error:', error);
    return res.status(500).json({ error: error.message });
  }
});


module.exports = router;
