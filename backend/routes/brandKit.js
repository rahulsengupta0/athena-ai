/* eslint-env node */
/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");
const axios = require("axios");
const s3 = require("../utils/s3");
const authMiddleware = require("../middlewares/auth");
const BrandKit = require("../model/BrandKit");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 🧠 Step 1: Create AI prompts
function getPrompts({ name, tagline, primaryColor, secondaryColor, logoDescription, bannerDescription, posterDescription }) {
  // Use individual descriptions if provided, otherwise fall back to default prompts
  const logoPrompt = logoDescription 
    ? `${logoDescription}. Brand name: ${name}. Colors: ${primaryColor} and ${secondaryColor}. ${tagline ? `Tagline: ${tagline}` : ''}`
    : `${name} logo in ${primaryColor} and ${secondaryColor}, modern, flat style. Tagline: ${tagline}`;
  
  const bannerPrompt = bannerDescription
    ? `${bannerDescription}. Brand name: ${name}. Colors: ${primaryColor} and ${secondaryColor}. ${tagline ? `Tagline: ${tagline}` : ''}`
    : `${name} brand banner using ${primaryColor}, tagline: ${tagline}, clean abstract design`;
  
  const posterPrompt = posterDescription
    ? `${posterDescription}. Brand name: ${name}. Colors: ${primaryColor} and ${secondaryColor}. ${tagline ? `Tagline: ${tagline}` : ''}`
    : `Promotional poster for ${name}, tagline: "${tagline}", colors: ${primaryColor} and ${secondaryColor}, professional and attractive`;
  
  return {
    logo: logoPrompt,
    banner: bannerPrompt,
    poster: posterPrompt
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
    const { name, tagline, primaryColor, secondaryColor, logoDescription, bannerDescription, posterDescription } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: "Brand name is required" });
    }
    
    if (!logoDescription || !bannerDescription || !posterDescription) {
      return res.status(400).json({ error: "Logo, banner, and poster descriptions are required" });
    }
    
    const userId = req.user.id; // comes from decoded JWT
    const kitFolder = name.toLowerCase().replace(/ /g, "-") + "-" + Date.now();

    // Build prompts using individual descriptions
    const prompts = getPrompts({ 
      name, 
      tagline, 
      primaryColor, 
      secondaryColor, 
      logoDescription, 
      bannerDescription, 
      posterDescription 
    });

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

// Helper function to process S3 objects into folder map
function processS3Objects(allObjects, Bucket, folderMap = {}) {
  for (const obj of allObjects) {
    const key = obj.Key; // e.g., 123/brandkit/acme-123/banner.png
    const parts = key.split("/");
    if (parts.length < 4) continue;
    const kitFolder = parts[2];
    const fileName = parts[3];
    // Extract type from filename (could be logo, banner, poster, or custom-*)
    const type = fileName.replace(/\.[^/.]+$/, ""); // remove extension
    if (!folderMap[kitFolder]) {
      folderMap[kitFolder] = { kitFolder, files: {} };
    }
    // If it's a known type (logo, banner, poster), store it directly
    // Otherwise, add to a custom array
    if (['logo', 'banner', 'poster'].includes(type)) {
      folderMap[kitFolder].files[type] = {
        key,
        url: `https://${Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        fileName: fileName,
      };
    } else {
      // For custom files, add to a custom array
      if (!folderMap[kitFolder].files.custom) {
        folderMap[kitFolder].files.custom = [];
      }
      folderMap[kitFolder].files.custom.push({
        key,
        url: `https://${Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        fileName: fileName,
        type: type
      });
    }
  }
  return folderMap;
}

// List brand kit folders and images for the authenticated user (own + shared)
router.get("/brandkit-list", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const Bucket = process.env.AWS_S3_BUCKET;
    if (!Bucket) {
      return res.status(500).json({ error: "Missing AWS_S3_BUCKET" });
    }

    // Get own brand kit folders
    const ownPrefix = `${userId}/brandkit/`;
    let ContinuationToken = undefined;
    const allObjects = [];

    do {
      // Paginate in case there are many objects
      const resp = await s3
        .listObjectsV2({ Bucket, Prefix: ownPrefix, ContinuationToken })
        .promise();
      (resp.Contents || []).forEach((obj) => allObjects.push(obj));
      ContinuationToken = resp.IsTruncated ? resp.NextContinuationToken : undefined;
    } while (ContinuationToken);

    // Get shared brand kits and their folders
    const sharedBrandKits = await BrandKit.find({ collaborators: userId }).populate('userId', 'firstName lastName email');
    
    // Fetch folders for each shared brand kit
    for (const sharedKit of sharedBrandKits) {
      const ownerId = sharedKit.userId._id.toString();
      const sharedPrefix = `${ownerId}/brandkit/`;
      let sharedContinuationToken = undefined;
      
      do {
        try {
          const resp = await s3
            .listObjectsV2({ Bucket, Prefix: sharedPrefix, ContinuationToken: sharedContinuationToken })
            .promise();
          (resp.Contents || []).forEach((obj) => allObjects.push(obj));
          sharedContinuationToken = resp.IsTruncated ? resp.NextContinuationToken : undefined;
        } catch (s3Error) {
          console.error(`Error fetching shared brand kit folders for owner ${ownerId}:`, s3Error);
          break; // Continue with next shared kit
        }
      } while (sharedContinuationToken);
    }

    // Group by kit folder name: <userId>/brandkit/<kitFolder>/<type>.png
    const folderMap = processS3Objects(allObjects, Bucket);

    const kits = Object.values(folderMap).sort((a, b) => a.kitFolder < b.kitFolder ? 1 : -1);
    res.json(kits);
  } catch (err) {
    console.error("❌ BrandKit list error:", err);
    res.status(500).json({ error: "Failed to list brand kits." });
  }
});

// Add image to brand kit folder (must come before delete route for proper matching)
router.post("/brandkit/:kitFolder/add-image", authMiddleware, async (req, res) => {
  try {
    console.log('Add image route hit, params:', req.params, 'body:', req.body);
    const userId = req.user.id;
    let { kitFolder } = req.params;
    kitFolder = decodeURIComponent(kitFolder);
    const { imageUrl, category, fileName } = req.body;
    
    if (!imageUrl || !category) {
      return res.status(400).json({ error: "Image URL and category are required" });
    }

    const Bucket = process.env.AWS_S3_BUCKET;
    if (!Bucket) {
      return res.status(500).json({ error: "Missing AWS_S3_BUCKET" });
    }

    // Download image from URL
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");
    
    // Determine file extension from URL or use png as default
    const urlExtension = imageUrl.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/i)?.[1] || 'png';
    const finalFileName = fileName || `${category}.${urlExtension}`;
    
    // Upload to S3
    const params = {
      Bucket,
      Key: `${userId}/brandkit/${kitFolder}/${finalFileName}`,
      Body: buffer,
      ContentType: `image/${urlExtension === 'jpg' ? 'jpeg' : urlExtension}`,
    };

    const uploadResult = await s3.upload(params).promise();
    
    res.json({
      success: true,
      url: uploadResult.Location,
      key: params.Key,
      category,
      fileName: finalFileName
    });
  } catch (err) {
    console.error("❌ BrandKit add image error:", err);
    res.status(500).json({ error: "Failed to add image to brand kit." });
  }
});

// Delete brand kit folder from S3
// Support both path parameter and query parameter for flexibility
router.delete("/brandkit/:kitFolder", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    // Get kitFolder from params or query
    let kitFolder = req.params.kitFolder || req.query.kitFolder;
    
    if (!kitFolder) {
      return res.status(400).json({ error: "Kit folder name is required" });
    }
    
    // Decode the kitFolder parameter in case it was URL encoded
    kitFolder = decodeURIComponent(kitFolder);
    const Bucket = process.env.AWS_S3_BUCKET;
    
    if (!Bucket) {
      return res.status(500).json({ error: "Missing AWS_S3_BUCKET" });
    }

    const Prefix = `${userId}/brandkit/${kitFolder}/`;
    
    // List all objects in the folder
    let ContinuationToken = undefined;
    const objectsToDelete = [];

    do {
      const resp = await s3
        .listObjectsV2({ Bucket, Prefix, ContinuationToken })
        .promise();
      
      if (resp.Contents && resp.Contents.length > 0) {
        resp.Contents.forEach((obj) => {
          objectsToDelete.push({ Key: obj.Key });
        });
      }
      
      ContinuationToken = resp.IsTruncated ? resp.NextContinuationToken : undefined;
    } while (ContinuationToken);

    // Delete all objects
    if (objectsToDelete.length > 0) {
      await s3
        .deleteObjects({
          Bucket,
          Delete: {
            Objects: objectsToDelete,
            Quiet: false,
          },
        })
        .promise();
    }

    res.json({ msg: "Brand kit folder deleted successfully from S3" });
  } catch (err) {
    console.error("❌ BrandKit delete error:", err);
    res.status(500).json({ error: "Failed to delete brand kit folder." });
  }
});

// Delete a specific image from brand kit folder
router.delete("/brandkit/:kitFolder/image/:fileName", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    let { kitFolder, fileName } = req.params;
    kitFolder = decodeURIComponent(kitFolder);
    fileName = decodeURIComponent(fileName);
    
    const Bucket = process.env.AWS_S3_BUCKET;
    if (!Bucket) {
      return res.status(500).json({ error: "Missing AWS_S3_BUCKET" });
    }

    const Key = `${userId}/brandkit/${kitFolder}/${fileName}`;
    
    // Delete the object from S3
    await s3.deleteObject({ Bucket, Key }).promise();
    
    res.json({ 
      success: true,
      msg: "Image deleted successfully" 
    });
  } catch (err) {
    console.error("❌ BrandKit delete image error:", err);
    res.status(500).json({ error: "Failed to delete image." });
  }
});

module.exports = router;