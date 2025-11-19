const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph } = require('docx');
const XLSX = require('xlsx');
const pptxgen = require("pptxgenjs");
const s3 = require("../utils/s3");
const authMiddleware = require("../middlewares/auth");
const { v4: uuidv4 } = require('uuid');

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

async function createDOCX(text) {
  const doc = new Document({
    sections: [{ properties: {}, children: [new Paragraph(text)] }]
  });
  return await Packer.toBuffer(doc);
}

function createXLSX(text) {
  const rows = text.split("\n").map(line => [line]);
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

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

async function createPPTX(text) {
  const pptx = new pptxgen();
  let slide = pptx.addSlide();
  slide.addText(text, { x: 1, y: 1, fontSize: 18 });
  return await pptx.write("buffer"); // valid PPTX buffer
}

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

// ---------------- S3 UPLOAD HELPER ----------------
async function uploadBufferToS3(buffer, userId, folder, filename, mimeType) {
  const Key = `${userId}/document-generation/${folder}/${filename}`;
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key,
    Body: buffer,
    ContentType: mimeType,
    // ACL: 'public-read', // enable if bucket policy requires
  };
  const uploadResult = await s3.upload(params).promise();
  return uploadResult.Location; // URL of uploaded file
}

// ---------------- MAIN ROUTE ----------------
router.post('/generate-document', authMiddleware, async (req, res) => {
  const { prompt, format, folderName } = req.body;
  try {
    const userId = req.user.id;
    const docText = await generateWithOpenAI(prompt);

    let buffer, mime, ext;

    switch (format) {
      case 'pdf':
        buffer = await createPDF(docText);
        mime = 'application/pdf';
        ext = 'pdf';
        break;
      case 'docx':
        buffer = await createDOCX(docText);
        mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        ext = 'docx';
        break;
      case 'xlsx':
        buffer = createXLSX(docText);
        mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        ext = 'xlsx';
        break;
      case 'csv':
        buffer = createCSV(docText);
        mime = 'text/csv';
        ext = 'csv';
        break;
      case 'txt':
        buffer = createTXT(docText);
        mime = 'text/plain';
        ext = 'txt';
        break;
      case 'md':
        buffer = createMarkdown(docText);
        mime = 'text/markdown';
        ext = 'md';
        break;
      case 'json':
        buffer = createJSON(docText);
        mime = 'application/json';
        ext = 'json';
        break;
      case 'image':
        buffer = createImage();
        mime = 'image/png';
        ext = 'png';
        break;
      case 'pptx':
        buffer = await createPPTX(docText);
        mime = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        ext = 'pptx';
        break;
      default:
        return res.status(400).json({ error: "Unsupported format" });
    }

    const folder = folderName ? folderName.replace(/ /g, '-').toLowerCase() : `${Date.now()}`;
    const filename = `${Date.now()}-${uuidv4()}.${ext}`;

    const fileUrl = await uploadBufferToS3(buffer, userId, folder, filename, mime);

    res.json({
      fileUrl,
      filename,
      format,
      folder,
    });

  } catch (err) {
    console.error("Document generation/upload error:", err);
    res.status(500).json({ error: "Document generation failed." });
  }
});

module.exports = router;
