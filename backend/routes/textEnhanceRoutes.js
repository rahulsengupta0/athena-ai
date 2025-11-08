const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

// POST /api/text-enhance/enhance
router.post("/enhance", async (req, res) => {
  try {
    const { text, isHeading = false } = req.body;
    
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text is required" });
    }

    // Create different prompts for headings vs regular text
    const systemPrompt = isHeading
      ? "You are an expert copywriter specializing in creating compelling, attention-grabbing headings. Enhance the given heading to make it more engaging, clear, and impactful while maintaining its core message. Return only the enhanced heading without any explanations."
      : "You are an expert copywriter and content editor. Enhance the given text to make it more engaging, clear, professional, and impactful while maintaining its core message and meaning. Improve grammar, clarity, and flow. Return only the enhanced text without any explanations.";

    const userPrompt = isHeading
      ? `Enhance this heading: "${text}"`
      : `Enhance this text: "${text}"`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        max_completion_tokens: 500,
        temperature: 0.7,
      }),
    });

    const raw = await response.text();
    if (!response.ok) {
      console.error("OpenAI API error:", raw);
      return res.status(500).json({ error: `OpenAI error: ${raw}` });
    }

    const data = JSON.parse(raw);
    const enhancedText = data.choices?.[0]?.message?.content?.trim() || "";

    if (!enhancedText) {
      return res.status(500).json({ error: "No enhanced text generated from OpenAI" });
    }

    res.json({ enhancedText });
  } catch (err) {
    console.error("Text enhancement error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

