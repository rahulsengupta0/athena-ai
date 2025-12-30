// routes/videoRoutes.js
const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

const OPENAI_API = "https://api.openai.com/v1";
const POLL_INTERVAL = 10000; // 10 seconds

router.post("/generate-video", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    // 1️⃣ Start the render job
    const startResponse = await fetch(`${OPENAI_API}/videos`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  model: "sora-2",
  prompt,
  size: "1280x720",
  seconds: "8", // ✅ must be a string, not an integer
}),

    });

    if (!startResponse.ok) {
      const text = await startResponse.text();
      console.error("❌ Failed to start video job:", text);
      return res.status(500).json({ error: text });
    }

    const job = await startResponse.json();
    console.log("🎬 Job started:", job.id, job.status);

    // 2️⃣ Poll for completion
    let status = job.status;
    let videoResult;

    while (status !== "completed" && status !== "failed") {
      await new Promise((r) => setTimeout(r, POLL_INTERVAL));

      const pollResponse = await fetch(`${OPENAI_API}/videos/${job.id}`, {
        headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` },
      });

      const pollData = await pollResponse.json();
      status = pollData.status;
      console.log(`📊 Job ${job.id} status: ${status} (${pollData.progress || 0}%)`);

      if (status === "completed") {
        videoResult = pollData;
      } else if (status === "failed") {
        return res.status(500).json({ error: "Video generation failed" });
      }
    }

    // 3️⃣ Fetch final MP4
    const finalResponse = await fetch(`${OPENAI_API}/videos/${job.id}/content`, {
      headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` },
    });

    if (!finalResponse.ok) {
      const errText = await finalResponse.text();
      console.error("❌ Failed to fetch video content:", errText);
      return res.status(500).json({ error: errText });
    }

    // 4️⃣ Stream the video or send it as base64
    const videoBuffer = await finalResponse.arrayBuffer();
    const base64Video = Buffer.from(videoBuffer).toString("base64");

    res.json({
      id: job.id,
      status: "completed",
      mimeType: "video/mp4",
      videoBase64: base64Video,
    });
  } catch (err) {
    console.error("🔥 Video generation error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
