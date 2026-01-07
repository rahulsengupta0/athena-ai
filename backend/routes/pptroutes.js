const express = require('express');
const { OpenAI } = require('openai');
const pptxgen = require('pptxgenjs');
const authMiddleware = require('../middlewares/auth.js')
const validateOpenAIApiKey = require('../middlewares/validateOpenAIApiKey.js');
const PresentationOutline = require('../model/PresentationOutline.js');
const s3 = require('../utils/s3');
const router = express.Router();

// OpenAI init
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


/**
 * Generate presentation data using OpenAI
 * @param {Object} params - Presentation generation parameters
 * @param {string} params.topic - The presentation topic
 * @param {string} params.tone - The tone of the presentation
 * @param {string} params.length - Number of slides
 * @param {string} params.mediaStyle - Style of media to include
 * @param {boolean} params.useBrandStyle - Whether to use brand styling
 * @param {string} params.outlineText - Optional outline text
 * @returns {Promise<Object>} Generated presentation data
 */
router.post('/get-presentation-data', validateOpenAIApiKey, authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in token' });
    }

    const { topic, tone, length, mediaStyle, outlineText } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const validLength = parseInt(length) || 10;
    if (validLength < 1 || validLength > 20) {
      return res.status(400).json({ error: 'Length must be between 1 and 20' });
    }

    const validTones = ['professional', 'friendly', 'minimal', 'corporate', 'creative'];
    const normalizedTone = tone ? tone.toLowerCase() : 'professional';
    if (!validTones.includes(normalizedTone)) {
      return res.status(400).json({ error: `Invalid tone. Allowed: ${validTones.join(', ')}` });
    }

    const validMediaStyles = ['AI Graphics', 'Stock Images', 'None'];
    const validatedMediaStyle = validMediaStyles.includes(mediaStyle) ? mediaStyle : 'AI Graphics';

    const openaiPrompt = `
      You are an expert presentation planner.

      Create a presentation OUTLINE based on the following inputs:
      Topic: ${topic}
      Tone: ${normalizedTone}
      Number of slides: ${validLength}
      Outline Text: ${outlineText || 'No specific outline provided, create a logical flow.'}
      MediaStyle: ${validatedMediaStyle}

      Rules:
      - This is an outline preview.
      - Decide slide content type intelligently (bullets, paragraph, comparison).
      - Avoid slides that look too empty or too text-heavy.
      - Keep content concise but meaningful.
      - **CRITICAL: Since MediaStyle is '${validatedMediaStyle}', you MUST include a detailed 'imagePrompt' field for every slide describing the visual.**
      - If MediaStyle is 'None', leave 'imagePrompt' empty.

      Return ONLY valid JSON in the exact format specified below.
      Do not add explanations or markdown.

      {
        "meta": {
          "topic": "Presentation Topic",
          "tone": "Tone used",
          "slideCount": "Number of slides",
          "stage": "outline"
        },
        "slides": [
          {
            "slideNo": 1,
            "title": "Slide Title",
            "layout": "title",
            "contentType": "paragraph",
            "content": "Slide Content",
            "imagePrompt": "A futuristic digital illustration representing [Topic], high resolution, abstract style"
          },
          {
            "slideNo": 2,
            "title": "Slide Title",
            "layout": "content",
            "contentType": "bullets",
            "content": [
              "Bullet Point 1",
              "Bullet Point 2"
            ],
            "imagePrompt": "A clean vector icon comparing two items, flat design, minimal background"
          },
          {
            "slideNo": 3,
            "title": "Slide Title",
            "layout": "content",
            "contentType": "comparison",
            "content": {
              "left": [ "Point A1", "Point A2" ],
              "right": [ "Point B1", "Point B2" ]
            },
            "imagePrompt": "Split screen concept art showing contrast between old and new technology"
          }
        ]
      }
    `;

    // 5. CALL OPENAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert presentation creator. Output ONLY valid JSON.' },
        { role: 'user', content: openaiPrompt }
      ],
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: "json_object" }
    });

    let presentationData;

    try {
      let responseText = completion.choices[0]?.message?.content?.trim();

      if (responseText.startsWith('```json')) {
        responseText = responseText.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (responseText.startsWith('```')) {
        responseText = responseText.replace(/^```/, '').replace(/```$/, '').trim();
      }

      presentationData = JSON.parse(responseText);

      const newPresentation = new PresentationOutline({
        userId: userId,
        meta: {
          topic: presentationData.meta.topic || topic,
          tone: presentationData.meta.tone || normalizedTone,
          slideCount: presentationData.meta.slideCount || validLength,
          stage: 'outline'
        },
        slides: presentationData.slides
      });

      const savedPresentation = await newPresentation.save();
      console.log('Saved Presentation ID:', savedPresentation._id);

      const responseData = savedPresentation.toObject();

      if (responseData.slides && Array.isArray(responseData.slides)) {
        responseData.slides = responseData.slides.map(slide => {
          const { imagePrompt, _id, ...cleanSlide } = slide;
          return cleanSlide;
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Presentation generated and saved successfully',
        presentationId: savedPresentation._id,
        data: responseData // This object now has no imagePrompt or _id in slides
      });

    } catch (parseError) {
      console.error('Error parsing/saving data:', parseError);
      return res.status(500).json({
        error: 'Failed to generate valid presentation structure.',
        details: parseError.message
      });
    }

  } catch (error) {
    console.error('API Error:', error);
    let status = 500;
    let message = 'Internal Server Error';

    if (error.response) {
      status = error.response.status;
      message = error.response.data?.error?.message || 'OpenAI API Error';
    } else {
      message = error.message;
    }

    return res.status(status).json({ error: message });
  }
});

/**
 * Rewrite slide content using AI
 */
router.post('/rewrite-slide', validateOpenAIApiKey, async (req, res) => {
  try {
    const { content, instruction } = req.body;
    if (!content || !instruction) return res.status(400).json({ error: "Missing fields" });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert content editor. Improve the content as requested while maintaining the core meaning.'
        },
        {
          role: 'user',
          content: `Content: ${content}

Instruction: ${instruction}

Return only the improved content in the same format.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const rewrittenContent = completion.choices[0]?.message?.content?.trim();

    res.json({ rewrittenContent });
  } catch (e) {
    console.error('Rewrite error:', e);
    res.status(500).json({ error: e.message });
  }
});

/**
 * Generate single slide image
 */
router.post('/generate-slide-image', validateOpenAIApiKey, async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt required" });

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json'
    });

    const imageBase64 = response.data[0].b64_json;

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(imageBase64, 'base64');

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 9);
    const filename = `presentation-image-${timestamp}-${randomId}.png`;

    // Upload to S3 temp folder
    const s3Key = `temp/presentation-images/${filename}`;
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: s3Key,
      Body: imageBuffer,
      ContentType: 'image/png',
    };

    const uploadResult = await s3.upload(params).promise();

    // Return the S3 URL
    res.json({ imageUrl: uploadResult.Location });
  } catch(e) {
    console.error('Image generation error:', e);
    res.status(500).json({ error: e.message });
  }
});

/**
 * Get presentation details by ID
 */
router.get('/:id', validateOpenAIApiKey, async (req, res) => {
  try {
    const { id } = req.params;

    // For now, we'll return a placeholder since we're not storing presentations
    // In a real implementation, you would fetch from a database
    return res.json({
      id: id,
      title: `Presentation ${id}`,
      slides: [],
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching presentation:', error.response?.data || error.message);

    const errorMessage = error.response?.data || error.message || 'Unknown error occurred';
    const errorStatus = error.response?.status || 500;
    return res.status(errorStatus).json({
      error: errorMessage,
      status: errorStatus,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Update presentation content
 */
router.put('/:id', validateOpenAIApiKey, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // For now, return the updates as received
    // In a real implementation, you would update in a database
    return res.json({
      id: id,
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating presentation:', error.response?.data || error.message);
    const errorMessage = error.response?.data || error.message || 'Unknown error occurred';
    const errorStatus = error.response?.status || 500;
    return res.status(errorStatus).json({
      error: errorMessage,
      status: errorStatus,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Delete a presentation
 */
router.delete('/:id', validateOpenAIApiKey, async (req, res) => {
  try {
    const { id } = req.params;

    // For now, return success
    // In a real implementation, you would delete from a database
    return res.json({ success: true });
  } catch (error) {
    console.error('Error deleting presentation:', error.response?.data || error.message);
    const errorMessage = error.response?.data || error.message || 'Unknown error occurred';
    const errorStatus = error.response?.status || 500;
    return res.status(errorStatus).json({
      error: errorMessage,
      status: errorStatus,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * List user's presentations
 */
router.get('/', validateOpenAIApiKey, async (req, res) => {
  try {
    // For now, return an empty list
    // In a real implementation, you would fetch from a database
    return res.json({
      presentations: []
    });
  } catch (error) {
    console.error('Error listing presentations:', error.response?.data || error.message);

    const errorMessage = error.response?.data || error.message || 'Unknown error occurred';
    const errorStatus = error.response?.status || 500;
    return res.status(errorStatus).json({
      error: errorMessage,
      status: errorStatus,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Export presentation to various formats
 */
router.post('/:id/export', validateOpenAIApiKey, async (req, res) => {
  try {
    const { id } = req.params;
    const { format } = req.body;

    // For now, we'll create a simple PowerPoint file using pptxgenjs
    // In a real implementation, you would fetch the presentation data from a database
    const pptx = new pptxgen();

    // Add some sample slides (in a real implementation, you would use actual presentation data)
    for (let i = 1; i <= 3; i++) {
      const slide = pptx.addSlide();
      slide.addText(`Slide ${i} Title`, { x: 1, y: 0.5, w: 8, h: 1, fontSize: 24, bold: true });
      slide.addText(`Content for slide ${i}\nThis is where the content would go.`, { x: 1, y: 1.5, w: 8, h: 4, fontSize: 16 });
    }

    // Generate the presentation as a buffer
    const buffer = await pptx.write('buffer');

    // For now, we'll return the buffer as a base64 string
    // In a real implementation, you might save to S3 and return a download URL
    const base64Data = buffer.toString('base64');

    return res.json({
      downloadUrl: `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${base64Data}`,
      format: format,
      size: buffer.length
    });
  } catch (error) {
    console.error('Error exporting presentation:', error.response?.data || error.message);
    // Provide more detailed error information
    const errorMessage = error.response?.data || error.message || 'Unknown error occurred';
    const errorStatus = error.response?.status || 500;
    return res.status(errorStatus).json({
      error: errorMessage,
      status: errorStatus,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Save presentation
 */
router.post('/save', async (req, res) => {
  try {
    const { slides } = req.body;

    // For now, we'll just return a mock ID
    // In a real implementation, this would save to a database
    const presentationId = `pres_${Date.now()}`;

    return res.json({
      id: presentationId,
      message: 'Presentation saved successfully'
    });
  } catch (error) {
    console.error('Error saving presentation:', error.message);
    const errorMessage = error.message || 'Unknown error occurred';
    const errorStatus = 500;
    return res.status(errorStatus).json({
      error: errorMessage,
      status: errorStatus,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Share presentation
 */
router.post('/share', async (req, res) => {
  try {
    const { slides } = req.body;

    // For now, we'll just return a mock URL
    // In a real implementation, this would create a shareable link
    const shareUrl = `https://athena-ai.presentation/${Date.now()}`;

    return res.json({
      shareUrl: shareUrl
    });
  } catch (error) {
    console.error('Error sharing presentation:', error.message);
    const errorMessage = error.message || 'Unknown error occurred';
    const errorStatus = 500;
    return res.status(errorStatus).json({
      error: errorMessage,
      status: errorStatus,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;