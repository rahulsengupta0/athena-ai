const OpenAI = require("openai");
require("dotenv").config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generate AI presentation data
 * @param {string} topic - Presentation topic
 * @param {object} options - { tone, length, mediaStyle, useBrandStyle, outlineText }
 */

const generatePresentationData = async (topic, options = {}) => {
  const { tone = 'Professional', length = '10', mediaStyle = 'AI Graphics', useBrandStyle = false, outlineText = '' } = options;
  
  const prompt = `
You are an expert AI presentation designer. Create a professional, modern presentation about "${topic}".
Tone: ${tone}
Length: ${length} slides
Media Style: ${mediaStyle}
Use Brand Style: ${useBrandStyle}
Outline (if provided): ${outlineText}

Return ONLY valid JSON with this structure:
{
  "theme": {
    "backgroundColor": "bgcolour acc to the topic",
    "textColor": "textcolour acc to the topic",
    "accentColor": "accent colour acc to the topic ",
    "font": "font colour acc to the topic"
  },
  "slides": [
    {
      "title": "Slide Title",
      "type": "bullet",
      "bullets": ["Bullet point 1", "Bullet point 2"],
      "speakerNotes": "Notes"
    }
  ]
}

`;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert AI presentation designer specializing in modern presentations and images." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const raw = completion.choices[0].message.content;
    let data = JSON.parse(raw);

    // Safety processing
    data.slides = (data.slides || []).map(slide => {
      slide.type = slide.type || "bullet";
      slide.speakerNotes = slide.speakerNotes || "";
      slide.bullets = Array.isArray(slide.bullets) ? slide.bullets : (slide.content?.split(/\n|\. /).filter(Boolean) || []);
      if (slide.type === "chart") {
        slide.chartData = slide.chartData || { labels: ["A","B"], values: [10,20] };
        const { labels, values } = slide.chartData;
        slide.chartData.labels = Array.isArray(labels) ? labels : ["A","B"];
        slide.chartData.values = Array.isArray(values) ? values : [10,20];
      }
      if (slide.type === "image") {
        slide.imagePrompt = slide.imagePrompt || `Professional high-quality image related to '${topic}'`;
      }
      return slide;
    });

    return {
      theme: {
        backgroundColor: data.theme?.backgroundColor || "#0F172A",
        textColor: data.theme?.textColor || "#F1F5F9",
        accentColor: data.theme?.accentColor || "#00FFFF",
        font: data.theme?.font || "Segoe UI",
      },
      slides: data.slides.length ? data.slides : [{ title: topic, type: "bullet", bullets: ["Point 1","Point 2","Point 3"] }]
    };

  } catch (error) {
    console.error("OpenAI Error:", error);
    throw new Error("Failed to generate presentation data");
  }
};

/**
 * Rewrite slide content based on instruction
 * @param {string} slideContent - Current slide text
 * @param {string} instruction - Instruction to rewrite
 */

const rewriteContent = async (slideContent, instruction) => {
  const prompt = `
Rewrite the following slide content according to the instruction:
Instruction: ${instruction}
Content:
${slideContent}
Return only the rewritten content as plain text.
`;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });
    return { rewrittenContent: completion.choices[0].message.content.trim() };
  } catch (error) {
    console.error(" OpenAI Rewrite Error:", error);
    throw new Error("Failed to rewrite slide content");
  }
};

module.exports = {
  generatePresentationData,
  rewriteContent
};
