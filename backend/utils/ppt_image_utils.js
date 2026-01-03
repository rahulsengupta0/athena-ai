import OpenAI from "openai";
import PptxGenJS from "pptxgenjs";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const IMAGE_GENERATION_TIMEOUT = 90000;

export const generateImageDataUri = async (prompt) => {
  const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Image generation timeout")), IMAGE_GENERATION_TIMEOUT));

  const result = await Promise.race([
    client.images.generate({ model: "dall-e-3", prompt, size: "1024x1024", response_format: "b64_json" }),
    timeoutPromise
  ]);

  if (!result?.data?.[0]?.b64_json) throw new Error("No base64 data from DALL-E");
  return result.data[0].b64_json;
};

// Generate all images for slides
export const generateAllImages = async (slides) => {
  const imageSlides = slides.filter(s => s.type === "image" && s.imagePrompt);
  const results = await Promise.allSettled(imageSlides.map(async s => {
    try {
      const base64Data = await generateImageDataUri(s.imagePrompt);
      return { title: s.title, base64Data };
    } catch (err) {
      console.error(`Image failed for ${s.title}:`, err);
      return { title: s.title, error: err.message };
    }
  }));

  const imageMap = {};
  results.forEach((r, i) => {
    const slide = imageSlides[i];
    if (r.status === "fulfilled" && r.value.base64Data) imageMap[slide.title] = r.value.base64Data;
  });
  return imageMap;
};

// Add chart safely
export const addSafeChart = (slide, slideData) => {
  if (!slideData.chartData?.labels?.length || !slideData.chartData?.values?.length) return;
  const len = Math.min(slideData.chartData.labels.length, slideData.chartData.values.length);
  const chartSeries = [{ name: slideData.title || "Series 1", labels: slideData.chartData.labels.slice(0,len), values: slideData.chartData.values.slice(0,len) }];
  try { slide.addChart({ type: "bar", data: chartSeries, x: 1, y: 1.8, w: 8, h: 4 }); }
  catch (err) { console.error("Chart add failed:", slideData.title, err); }
};

// Add image safely
export const addSafeImage = async (slide, slideData, imageMap) => {
  const base64Data = imageMap[slideData.title];
  if (!base64Data) {
    slide.addText("Image generation failed or timed out", { x:0.7, y:1.8, w:8.5, h:4.8, fontSize:20, color:"#FF0000", fontFace:"Arial", align:"center" });
    return;
  }
  try {
    slide.addImage({ data:`image/png;base64,${base64Data}`, x:0.7, y:1.8, w:8.5, h:4.8, sizing:{type:'contain',w:8.5,h:4.8} });
  } catch (err) {
    console.error("Image add failed:", slideData.title, err);
    slide.addText("Image unavailable", { x:0.7, y:1.8, w:8.5, h:4.8, fontSize:20, color:"#FF0000", fontFace:"Arial", align:"center" });
  }
};

// New function: Generate single image for a slide
export const generateSingleImage = async (prompt) => {
  const base64 = await generateImageDataUri(prompt);
  return base64;
};
