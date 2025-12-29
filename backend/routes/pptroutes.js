const express = require("express");
const cors = require("cors");
require("dotenv").config();
const PptxGenJS = require("pptxgenjs");
const {
  generatePresentationData,
  rewriteContent
} = require("../utils/ppt_openai_utils.js");

const { generateAllImages, addSafeChart, addSafeImage, generateSingleImage } = require("../utils/ppt_image_utils.js");

const app = express();

app.use(cors({ origin: "*", methods:["GET","POST"], allowedHeaders:["Content-Type"], credentials:true }));
app.use(express.json({ limit:'10mb' }));
app.use((req,res,next)=>{ req.setTimeout(300000); res.setTimeout(300000); next(); });

app.post("/get-presentation-data", async (req,res)=>{
  try {
    const { topic, tone, length, mediaStyle, useBrandStyle, outlineText } = req.body;
    if(!topic) return res.status(400).json({ error:"Topic required!" });
    
    const options = { tone, length, mediaStyle, useBrandStyle, outlineText };
    const data = await generatePresentationData(topic, options);
    res.json(data);
  } catch(e) { res.status(500).json({ error:"Failed to get presentation data", details:e.message }); }
});

app.post("/generate-ppt", async (req,res)=>{
  try {
    const { topic, editedData } = req.body;
    if(!topic) return res.status(400).json({ error:"Topic required!" });
    const data = editedData || await generatePresentationData(topic);
    const imageMap = await generateAllImages(data.slides);

    const pptx = new PptxGenJS();
    pptx.layout = "LAYOUT_WIDE";
    const theme = data.theme;

    for(let slideData of data.slides){
      const slide = pptx.addSlide();
      slide.background = { fill: theme.backgroundColor };
      slide.addText(slideData.title,{ x:0.5, y:0.5, fontSize:36, bold:true, color:theme.textColor, fontFace:theme.font, align:"center" });

      switch(slideData.type){
        case "chart": addSafeChart(slide, slideData); break;
        case "image": await addSafeImage(slide, slideData, imageMap); break;
        case "quote": slide.addText(slideData.bullets.join("\n"), { x:1, y:2, fontSize:28, color:theme.accentColor, italic:true, fontFace:theme.font, align:"center" }); break;
        default: slide.addText(slideData.bullets.join("\n"), { x:0.5, y:1.8, w:9, h:4, fontSize:22, color:theme.textColor, fontFace:theme.font, bullet:true });
      }
      if(slideData.speakerNotes) slide.addNotes(slideData.speakerNotes);
    }

    const buffer = await pptx.write({ outputType:'nodebuffer' });
    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition',`attachment; filename=presentation_${Date.now()}.pptx`);
    res.send(buffer);
  } catch(e){ res.status(500).json({ error:"PPT creation failed", details:e.message }); }
});
// Rewrite slide
app.post("/rewrite-slide", async (req, res) => {
  try {
    const { slideContent, instruction } = req.body;
    if (!slideContent || !instruction) return res.status(400).json({ error: "Missing fields" });
    const result = await rewriteContent(slideContent, instruction);
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Generate single slide image
app.post("/generate-slide-image", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt required" });
    const imageBase64 = await generateSingleImage(prompt);
    res.json({ imageBase64 });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = app;
