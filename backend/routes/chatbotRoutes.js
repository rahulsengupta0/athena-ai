require('dotenv').config();
const express = require('express');
const axios = require('axios');
const router = express.Router();

// URL where your Chroma FastAPI server runs
const CHROMA_URL = "http://localhost:8000";

// Open AI Bot Routes

router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    // Step 1: Fetch context from ChromaDB
    let contextDocs = "";
    try {
      const chromaResponse = await axios.get(`${CHROMA_URL}/search`, {
        params: { query: message },
      });

      if (chromaResponse.data?.matches?.length > 0) {
        contextDocs = chromaResponse.data.matches.join("\n");
        console.log("🧠 Retrieved context from ChromaDB");
      } else {
        contextDocs = "No relevant context found.";
        console.log("⚠️ No matches found in ChromaDB");
      }
    } catch (chromaErr) {
      console.error("❌ Error connecting to ChromaDB:", chromaErr.message);
      contextDocs = "Knowledge base unavailable.";
    }

    // Step 2: Build system prompt
    const systemPrompt = {
      role: "system",
      content: `
        You are Athena — a helpful, creative, and intelligent AI assistant created by Athena LMS.
        You assist users with questions about the Athena LMS platform.

        Here is important information from the knowledge base:
        ${contextDocs}

        Instructions:
        - Never mention OpenAI, ChatGPT, or any external system.
        - Always stay polite, concise, and friendly.
        - If users ask about navigation, guide them clearly based on the information above.
        - If a feature isn’t mentioned, respond gracefully: “That feature is not available yet.”
      `,
    };

    // Step 3: Send chat request to OpenAI
    const openaiKey = process.env.OPENAI_API_KEY;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4.1-mini',
        messages: [
          systemPrompt,
          ...(history || []), // history ALREADY includes the message
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Athena AI',
        },
      }
    );

    // Step 4: Send OpenAI response back to frontend
    const data = response.data;
    res.json({
      reply: data?.choices?.[0]?.message?.content || 'No response from Athena.',
    });

  } catch (error) {
    console.error('OpenAI API error:', error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
