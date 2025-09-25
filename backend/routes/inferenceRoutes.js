const express = require('express');
const { InferenceClient } = require('@huggingface/inference');
const router = express.Router();

const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

router.post('/generate', async (req, res) => {
  const prompt = req.body.prompt;
  try {
    const chatCompletion = await client.chatCompletion({
      provider: 'featherless-ai',
      model: 'HuggingFaceH4/zephyr-7b-beta',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });
    console.log('Chat completion response:', chatCompletion);
    res.json(chatCompletion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
