const express = require('express');
const { InferenceClient } = require('@huggingface/inference');
const router = express.Router();

const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

router.post('/generate-content', async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });
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
    if (
      chatCompletion &&
      chatCompletion.choices &&
      chatCompletion.choices.length > 0
    ) {
      return res.json({ result: chatCompletion.choices[0].message.content });
    }
    return res.status(500).json({ error: 'No valid response from AI model' });
  } catch (error) {
    console.error('Error generating content:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
