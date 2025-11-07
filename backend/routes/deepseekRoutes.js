const express = require('express');
const axios = require('axios');
const fs = require('fs');
const router = express.Router();

// ✅ Read your Athena info file once when the backend starts
const websiteInfo = fs.readFileSync('./data/athena_info.txt', 'utf8');

router.post('/deepseek/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    // Updated system prompt with the text file context
    const systemPrompt = {
      role: "system",
      content: `
        You are Athena — a helpful, creative, and intelligent AI assistant created by Athena LMS.
        You assist users with questions about the Athena LMS platform.

        Here is important information about Athena LMS:
        ${websiteInfo}

        Instructions:
        - Never mention DeepSeek, OpenRouter, or any external system.
        - Always stay polite, concise, and friendly.
        - If users ask about navigation, guide them clearly based on the information above.
        - If a feature isn’t mentioned, respond gracefully: “That feature is not available yet.”
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
