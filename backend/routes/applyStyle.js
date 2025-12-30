const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const OpenAI = require("openai");
const FormData = require("form-data");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/apply-style", upload.single("file"), async (req, res) => {
  try {
    const prompt = req.body.prompt;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const form = new FormData();
    form.append("model", "gpt-image-1");
    form.append("prompt", prompt);

    // Attach input image if provided
    if (req.file) {
      form.append("image[]", req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype
      });
    }

    // Call OpenAI
    const response = await client.images.generate({
      model: "gpt-image-1",
      prompt,
      // OpenAI SDK automatically handles FormData
      // but image[] must be attached via the client.images.edits
    });

    // FIX: Use the correct endpoint for image-to-image
    const edited = await client.images.edits({
      model: "gpt-image-1",
      prompt,
      image: req.file.buffer,
      size: "1024x1024"
    });

    const imageBase64 = edited.data[0].b64_json;

    res.json({ image: imageBase64 });
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
