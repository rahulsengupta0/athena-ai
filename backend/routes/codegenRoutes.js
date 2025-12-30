const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

// POST /api/codegen/generate-code
router.post("/generate-code", async (req, res) => {
  try {
    const { prompt, language, framework } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // ✅ Open-access model
        messages: [
          {
            role: "system",
            content:
              "You are an expert software engineer. Respond only with complete, clean, and well-formatted code. Do not include explanations or notes.",
          },
          {
            role: "user",
            content: `Write ${language} code using ${framework} for this prompt: ${prompt}`,
          },
        ],
        // ✅ Correct parameter names for newer models:
        max_completion_tokens: 800, // replaces max_tokens
        temperature: 1, // must be 1 (0.3 not allowed)
      }),
    });

    const raw = await response.text();
    if (!response.ok) {
      console.error("OpenAI API error:", raw);
      return res.status(500).json({ error: `OpenAI error: ${raw}` });
    }

    const data = JSON.parse(raw);
    const code = data.choices?.[0]?.message?.content?.trim() || "";

    if (!code) {
      return res.status(500).json({ error: "No code generated from OpenAI" });
    }

    res.json({ code });
  } catch (err) {
    console.error("Code generation error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
