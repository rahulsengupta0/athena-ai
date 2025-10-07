const express = require('express');
const { InferenceClient } = require('@huggingface/inference');
const router = express.Router();

const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

router.post('/generate-code', async (req, res) => {
  const { prompt, language, framework } = req.body;

  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    // Compose the prompt with language and framework info to steer generation
    const fullPrompt = `Generate a ${language} code snippet for ${framework}:\n${prompt}\n`;

    const response = await client.textGeneration({
      model: 'Salesforce/codegen-350M-mono',
      inputs: fullPrompt,
      parameters: {
        max_new_tokens: 150,
        temperature: 0.3,
        do_sample: false,
      }
    });

    if (response && response.generated_text) {
      return res.json({ code: response.generated_text });
    }

    return res.status(500).json({ error: 'Failed to generate code' });
  } catch (error) {
    console.error('Code generation error:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
