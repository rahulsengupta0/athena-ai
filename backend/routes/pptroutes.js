const express = require('express');
const { OpenAI } = require('openai');
const pptxgen = require('pptxgenjs');
const router = express.Router();

// OpenAI init
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Validate that OpenAI API key is set before allowing API calls
const validateApiKey = (req, res, next) => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.trim() === '') {
    return res.status(500).json({
      error: 'OPENAI_API_KEY is not configured in environment variables. Please set OPENAI_API_KEY in your .env file.'
    });
  }
  next();
};

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
router.post('/get-presentation-data', validateApiKey, async (req, res) => {
  try {
    const { prompt, tone, length, mediaStyle, useBrandStyle, outlineText } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    const { topic, tone, length, mediaStyle, useBrandStyle, outlineText } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    // Validate parameters
    const validLength = parseInt(length) || 10;
    if (validLength < 1 || validLength > 60) {
      return res.status(400).json({ error: 'Length must be a number between 1 and 60' });
    }

    // Validate tone
    const validTones = ['professional', 'friendly', 'minimal', 'corporate', 'creative'];
    const normalizedTone = tone ? tone.toLowerCase() : 'professional';
    if (!validTones.includes(normalizedTone)) {
      return res.status(400).json({ error: `Invalid tone. Must be one of: ${validTones.join(', ')}` });
    }

    // Validate mediaStyle
    const validMediaStyles = ['AI Graphics', 'Stock Images', 'None'];
    const validatedMediaStyle = validMediaStyles.includes(mediaStyle) ? mediaStyle : 'AI Graphics';

    // Prepare the OpenAI prompt for generating presentation content
    const openaiPrompt = `
      Create a detailed presentation about: ${topic}

      Requirements:
      - Create exactly ${validLength} slides
      - Use a ${normalizedTone} tone
      - Structure: Each slide should have a title, content (as bullet points), type, and speaker notes
      - Content should be well-organized with bullet points where appropriate
      - Suggest slide types: 'content' for regular slides, 'chart' for data slides, 'image' for visual slides, 'quote' for quote slides
      - If media style is 'AI Graphics', suggest image prompts for each slide
      - If media style is 'Stock Images', suggest relevant image descriptions
      - Include speaker notes for each slide with additional context
      - Format the response as JSON with the following structure:
      {
        "title": "Presentation Title",
        "theme": {
          "backgroundColor": "#FFFFFF",
          "textColor": "#000000",
          "accentColor": "#1E90FF",
          "font": "Arial"
        },
        "slides": [
          {
            "title": "Slide Title",
            "bullets": ["Bullet point 1", "Bullet point 2"],
            "type": "content|chart|image|quote",
            "imagePrompt": "Image prompt for this slide (if media style requires images)",
            "speakerNotes": "Additional notes for the presenter"
          }
        ]
      }

      ${outlineText ? `Use this outline as reference: ${outlineText}` : ''}

      Output ONLY the JSON structure, nothing else.
    `;

    // Call OpenAI to generate the presentation structure
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert presentation creator. Output ONLY valid JSON with no additional text or explanations.'
        },
        {
          role: 'user',
          content: openaiPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2500
    });

    let presentationData;
    try {
      // Extract the JSON from the response
      let responseText = completion.choices[0]?.message?.content?.trim();

      // Remove any markdown code block markers if present
      if (responseText.startsWith('```json')) {
        responseText = responseText.substring(7, responseText.lastIndexOf('```')).trim();
      } else if (responseText.startsWith('```')) {
        responseText = responseText.substring(3, responseText.lastIndexOf('```')).trim();
      }

      presentationData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.error('Raw response:', completion.choices[0]?.message?.content);

      // If parsing fails, generate a basic presentation structure
      presentationData = {
        title: `Presentation on ${topic.substring(0, 50)}...`,
        theme: {
          backgroundColor: "#FFFFFF",
          textColor: "#000000",
          accentColor: "#1E90FF",
          font: "Arial"
        },
        slides: Array.from({ length: parseInt(validLength) }, (_, i) => ({
          title: `Slide ${i + 1}: ${topic.substring(0, 30)}...`,
          bullets: [
            `Key point about ${topic}`,
            `Supporting detail for slide ${i + 1}`,
            `Action item or conclusion`
          ],
          type: "content",
          imagePrompt: `Image for ${topic} - slide ${i + 1}`,
          speakerNotes: `Notes for slide ${i + 1} about ${topic}`
        }))
      };
    }

    return res.json(presentationData);
  } catch (error) {
    console.error('Error generating presentation data:', error);

    let errorMessage = 'Unknown error occurred';
    let errorStatus = 500;

    if (error.response) {
      errorStatus = error.response.status;
      if (error.response.data && typeof error.response.data === 'object') {
        errorMessage = error.response.data.message || error.response.data.error || JSON.stringify(error.response.data);
      } else {
        errorMessage = error.response.data || `HTTP ${errorStatus}: ${error.response.statusText}`;
      }
    } else if (error.request) {
      errorMessage = 'No response received from OpenAI API. Please check your network connection and API key.';
    } else {
      errorMessage = error.message;
    }

    return res.status(errorStatus).json({
      error: errorMessage,
      status: errorStatus,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Generate PowerPoint file
 */
router.post('/generate-ppt', validateApiKey, async (req, res) => {
  try {
    const { topic, editedData } = req.body;
    if(!topic) return res.status(400).json({ error:"Topic required!" });

    const data = editedData;

    const pptx = new pptxgen();
    pptx.layout = "LAYOUT_WIDE";
    const theme = data.theme;

    for(let slideData of data.slides){
      const slide = pptx.addSlide();
      slide.background = { fill: theme.backgroundColor };
      slide.addText(slideData.title,{ x:0.5, y:0.5, fontSize:36, bold:true, color:theme.textColor, fontFace:theme.font, align:"center" });

      switch(slideData.type){
        case "chart":
          // Add a placeholder chart
          slide.addText("Chart Placeholder", { x: 1, y: 1, fontSize: 24, bold: true });
          slide.addText("Data visualization would appear here", { x: 1, y: 2, fontSize: 16 });
          break;
        case "image":
          // Add a placeholder image
          slide.addText("Image Placeholder", { x: 1, y: 1, fontSize: 24, bold: true });
          break;
        case "quote":
          slide.addText(slideData.bullets.join("\n"), { x:1, y:2, fontSize:28, color:theme.accentColor, italic:true, fontFace:theme.font, align:"center" });
          break;
        default:
          slide.addText(slideData.bullets.join("\n"), { x:0.5, y:1.8, w:9, h:4, fontSize:22, color:theme.textColor, fontFace:theme.font, bullet:true });
      }
      if(slideData.speakerNotes) slide.addNotes(slideData.speakerNotes);
    }

    const buffer = await pptx.write({ outputType:'nodebuffer' });
    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition',`attachment; filename=presentation_${Date.now()}.pptx`);
    res.send(buffer);
  } catch(e){
    console.error('PPT creation error:', e);
    res.status(500).json({ error:"PPT creation failed", details: e.message });
  }
});

/**
 * Rewrite slide content using AI
 */
router.post('/rewrite-slide', validateApiKey, async (req, res) => {
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
router.post('/generate-slide-image', validateApiKey, async (req, res) => {
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
    res.json({ imageBase64 });
  } catch(e) {
    console.error('Image generation error:', e);
    res.status(500).json({ error: e.message });
  }
});

/**
 * Get presentation details by ID
 */
router.get('/:id', validateApiKey, async (req, res) => {
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
router.put('/:id', validateApiKey, async (req, res) => {
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
router.delete('/:id', validateApiKey, async (req, res) => {
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
router.get('/', validateApiKey, async (req, res) => {
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
router.post('/:id/export', validateApiKey, async (req, res) => {
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