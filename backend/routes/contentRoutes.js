const express = require('express');
const OpenAI = require('openai');
const router = express.Router();

// ✅ Initialize OpenAI client with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/generate-content', async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // ✅ Use GPT-4-mini for generation
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a creative and knowledgeable content writer who writes in clear, engaging, and relevant language.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8, // adjust creativity (0–2)
      max_tokens: 600,  // limit response length
    });

    const result = completion.choices[0]?.message?.content?.trim();
    if (result) {
      return res.json({ result });
    }

    return res.status(500).json({ error: 'No valid response from model' });
  } catch (error) {
    console.error('Error generating content:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
