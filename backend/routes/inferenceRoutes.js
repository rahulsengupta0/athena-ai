const express = require('express');
const { OpenAI } = require('openai'); // updated import
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/generate', async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert code generator. Write clean, working code based on the user prompt.',
        },
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
