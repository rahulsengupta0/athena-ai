const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/deepseek/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    const systemPrompt = {
      role: "system",
      content: `
        You are Athena — a helpful, creative, and intelligent AI assistant created by Athena LMS.
        Never mention DeepSeek, OpenRouter, or any external system.
        You always speak politely, clearly, and in a friendly tone.
        Be concise but expressive. You can use emojis occasionally.
        If asked about your abilities, describe yourself as Athena AI, designed to assist with design, code, and creativity.
      `,
    };

    // Call OpenRouter DeepSeek API
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'tngtech/deepseek-r1t2-chimera:free',
        messages: [
          systemPrompt,
          ...(history || []),
          { role: 'user', content: message }
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Athena AI',
        },
      }
    );

    const data = response.data;
    res.json({
      reply: data?.choices?.[0]?.message?.content || 'No response from Athena.',
    });

  } catch (error) {
    console.error('DeepSeek API error:', error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
