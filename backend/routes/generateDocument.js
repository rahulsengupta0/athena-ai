const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph } = require('docx');
const XLSX = require('xlsx');
const pptxgen = require("pptxgenjs");

// OpenAI SDK init
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ---------------- OPENAI TEXT GENERATOR ----------------

async function generateWithOpenAI(prompt) {
  const completion = await openai.responses.create({
    model: "gpt-4o-mini",
    input: prompt
  });

  return completion.output_text;
}

// ---------------- DOCUMENT CREATORS ----------------

// FIXED ASYNC PDF GENERATOR
function createPDF(text) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    doc.fontSize(12).text(text);
    doc.end();
  });
}

// FIXED DOCX GENERATOR
async function createDOCX(text) {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [new Paragraph(text)]
    }]
  });

  return await Packer.toBuffer(doc);
}

// FIXED XLSX GENERATOR
function createXLSX(text) {
  const rows = text.split("\n").map(line => [line]);
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

// BASIC FORMATS
function createCSV(text) {
  return Buffer.from(text, 'utf-8');
}
function createTXT(text) {
  return Buffer.from(text, 'utf-8');
}
function createMarkdown(text) {
  return Buffer.from(text, 'utf-8');
}
function createJSON(text) {
  return Buffer.from(JSON.stringify({ result: text }, null, 2), 'utf-8');
}

// FIXED PPTX GENERATOR
async function createPPTX(text) {
  const pptx = new pptxgen();
  let slide = pptx.addSlide();
  slide.addText(text, { x: 1, y: 1, fontSize: 18 });

  return await pptx.write("buffer"); // returns a valid PPTX buffer
}

// PNG placeholder
function createImage() {
  return Buffer.from([
    0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A,
    0x00,0x00,0x00,0x0D,0x49,0x48,0x44,0x52,
    0x00,0x00,0x00,0x01,0x00,0x00,0x00,0x01,
    0x08,0x06,0x00,0x00,0x00,0x1F,0x15,0xC4,
    0x89,0x00,0x00,0x00,0x0A,0x49,0x44,0x41,
    0x54,0x78,0x9C,0x63,0x60,0x00,0x00,0x00,
    0x02,0x00,0x01,0xE2,0x21,0xBC,0x33,0x00,
    0x00,0x00,0x00,0x49,0x45,0x4E,0x44,0xAE,
    0x42,0x60,0x82
  ]);
}

// ---------------- MAIN ROUTE ----------------

router.post('/generate-document', async (req, res) => {
  const { prompt, format } = req.body;

  try {
    const docText = await generateWithOpenAI(prompt);

    let buffer, mime, filename;

    switch (format) {
      case 'pdf':
        buffer = await createPDF(docText);
        mime = 'application/pdf';
        filename = 'generated.pdf';
        break;

      case 'docx':
        buffer = await createDOCX(docText);
        mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        filename = 'generated.docx';
        break;

      case 'xlsx':
        buffer = createXLSX(docText);
        mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        filename = 'generated.xlsx';
        break;

      case 'csv':
        buffer = createCSV(docText);
        mime = 'text/csv';
        filename = 'generated.csv';
        break;

      case 'txt':
        buffer = createTXT(docText);
        mime = 'text/plain';
        filename = 'generated.txt';
        break;

      case 'md':
        buffer = createMarkdown(docText);
        mime = 'text/markdown';
        filename = 'generated.md';
        break;

      case 'json':
        buffer = createJSON(docText);
        mime = 'application/json';
        filename = 'generated.json';
        break;

      case 'image':
        buffer = createImage();
        mime = 'image/png';
        filename = 'generated.png';
        break;

      case 'pptx':
        buffer = await createPPTX(docText);
        mime = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        filename = 'generated.pptx';
        break;

      default:
        throw new Error("Unsupported format");
    }

    // Proper binary response
    res.setHeader('Content-Type', mime);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);

    return res.end(buffer);

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Document generation failed." });
  }
});

module.exports = router;
