/* eslint-env node */
/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");
const axios = require("axios");
const s3 = require("../utils/s3");
const authMiddleware = require("../middlewares/auth");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 🧠 Step 1: Create AI prompts
function getPrompts({ name, tagline, primaryColor, secondaryColor }) {
  return {
    logo: `${name} logo in ${primaryColor} and ${secondaryColor}, modern, flat style. Tagline: ${tagline}`,
    banner: `${name} brand banner using ${primaryColor}, tagline: ${tagline}, clean abstract design`,
    poster: `Promotional poster for ${name}, tagline: "${tagline}", colors: ${primaryColor} and ${secondaryColor}, professional and attractive`
  };
}

// 🧠 Step 2: Generate an image using OpenAI
async function generateImage(prompt) {
  const result = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    size: "1024x1024",
  });
  return result.data[0].url;
}

// 🧠 Step 3: Download image and upload to S3
async function uploadToS3(imageUrl, userId, kitFolder, type) {
  const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
  const buffer = Buffer.from(response.data, "binary");

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `${userId}/brandkit/${kitFolder}/${type}.png`,
    Body: buffer,
    ContentType: "image/png",
    //ACL: "public-read",
  };

  const uploadResult = await s3.upload(params).promise();
  return uploadResult.Location;
}

// 🧠 Step 4: API route to generate + upload
router.post("/generate-brandkit", authMiddleware, async (req, res) => {
  try {
    const { name, tagline, primaryColor, secondaryColor } = req.body;
    const userId = req.user.id; // comes from decoded JWT
    const kitFolder = name.toLowerCase().replace(/ /g, "-") + "-" + Date.now();

    // Build prompts
    const prompts = getPrompts({ name, tagline, primaryColor, secondaryColor });

    // Generate all 3 images
    const logoUrl = await generateImage(prompts.logo);
    const bannerUrl = await generateImage(prompts.banner);
    const posterUrl = await generateImage(prompts.poster);

    // Upload to S3
    const logoS3 = await uploadToS3(logoUrl, userId, kitFolder, "logo");
    const bannerS3 = await uploadToS3(bannerUrl, userId, kitFolder, "banner");
    const posterS3 = await uploadToS3(posterUrl, userId, kitFolder, "poster");

    res.json({
      logo: logoS3,
      banner: bannerS3,
      poster: posterS3,
      kitFolder,
    });
  } catch (err) {
    console.error("❌ BrandKit generation error:", err);
    res.status(500).json({ error: "Failed to generate brand kit." });
  }
});

// List brand kit folders and images for the authenticated user
router.get("/brandkit-list", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const Bucket = process.env.AWS_S3_BUCKET;
    if (!Bucket) {
      return res.status(500).json({ error: "Missing AWS_S3_BUCKET" });
    }

    const Prefix = `${userId}/brandkit/`;
    let ContinuationToken = undefined;
    const allObjects = [];

    do {
      // Paginate in case there are many objects
      const resp = await s3
        .listObjectsV2({ Bucket, Prefix, ContinuationToken })
        .promise();
      (resp.Contents || []).forEach((obj) => allObjects.push(obj));
      ContinuationToken = resp.IsTruncated ? resp.NextContinuationToken : undefined;
    } while (ContinuationToken);

    // Group by kit folder name: <userId>/brandkit/<kitFolder>/<type>.png
    const folderMap = {};
    for (const obj of allObjects) {
      const key = obj.Key; // e.g., 123/brandkit/acme-123/banner.png
      const parts = key.split("/");
      if (parts.length < 4) continue;
      const kitFolder = parts[2];
      const fileName = parts[3];
      const type = fileName.replace(/\.[^/.]+$/, ""); // remove extension
      if (!folderMap[kitFolder]) {
        folderMap[kitFolder] = { kitFolder, files: {} };
      }
      folderMap[kitFolder].files[type] = {
        key,
        url: `https://${Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      };
    }

    const kits = Object.values(folderMap).sort((a, b) => a.kitFolder < b.kitFolder ? 1 : -1);
    res.json(kits);
  } catch (err) {
    console.error("❌ BrandKit list error:", err);
    res.status(500).json({ error: "Failed to list brand kits." });
  }
});

module.exports = router;