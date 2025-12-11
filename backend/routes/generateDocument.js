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

// OpenAI init
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ---------------- OPENAI TEXT GENERATOR ----------------
async function generateWithOpenAI(prompt) {
const completion = await openai.responses.create({
  model: "gpt-4o-mini",
  input: [
    {
      role: "system",
      content: "You are an AI that outputs ONLY the raw content requested. Do NOT add any extra text, no introductions, no explanations, no suggestions like 'let me know if you need more', no closing lines. Output ONLY the document content—nothing else."
    },
    {
      role: "user",
      content: prompt
    }
  ]
});

return completion.output_text.trim();

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
    sections: [{ children: [new Paragraph(text)] }]
  });
  return await Packer.toBuffer(doc);
}

function createXLSX(text) {
  // Split into rows
  const lines = text.split("\n").map(line => line.trim()).filter(l => l !== "");

  // Split each line into columns
  const rows = lines.map(line => {
    return line.split(/[\s|-]+/); // split by space or dash
  });

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
}


function createCSV(text) {
  // Convert OpenAI text response into clean rows
  const lines = text.split("\n").map(line => line.trim()).filter(l => l !== "");

  // Convert each line into CSV values (split by spaces or hyphens etc.)
  const parsedLines = lines.map(line => {
    return line.split(/[\s|-]+/).join(",");
  });

  const csvContent = parsedLines.join("\n");
  return Buffer.from(csvContent, "utf-8");
}
function createCSV(text) {
  // Convert OpenAI text response into clean rows
  const lines = text.split("\n").map(line => line.trim()).filter(l => l !== "");

  // Convert each line into CSV values (split by spaces or hyphens etc.)
  const parsedLines = lines.map(line => {
    return line.split(/[\s|-]+/).join(",");
  });

  const csvContent = parsedLines.join("\n");
  return Buffer.from(csvContent, "utf-8");
}

function createTXT(text) { return Buffer.from(text, 'utf-8'); }
function createMarkdown(text) { return Buffer.from(text, 'utf-8'); }
function createJSON(text) {
  // Try to parse if AI already returned JSON
  try {
    const parsed = JSON.parse(text);
    return Buffer.from(JSON.stringify(parsed, null, 2));
  } catch (e) {}

  // Detect intent
  const intent = detectIntent(text);
  let output;

  switch (intent) {
    case "list":
      output = parseList(text);
      break;

    case "numberList":
      output = parseNumberList(text);
      break;

    case "keyValue":
      output = parseKeyValue(text);
      break;

    case "code":
      output = { code: text };
      break;

    case "paragraph":
      output = { content: text.replace(/\n/g, " ") }; // remove \n
      break;

    default:
      output = { content: text.replace(/\n/g, " ") };
      break;
  }

  return Buffer.from(
    JSON.stringify(
      {
        type: intent,
        output,
        raw: text.replace(/\n/g, " ") // remove \n from raw
      },
      null,
      2
    )
  );
}

function detectIntent(text) {
  if (/^\d+\./m.test(text)) return "numberList"; // numbered list
  if (text.includes(":")) return "keyValue";
  if (text.startsWith("-") || text.includes("\n-")) return "list";
  if (text.includes("{") || text.includes("function") || text.includes("=")) return "code";
  if (text.split(" ").length > 20) return "paragraph";
  return "unknown";
}

function parseList(text) {
  return text
    .split("\n")
    .map(line => line.replace(/^[-*]\s*/, "").trim())
    .filter(l => l);
}

function parseNumberList(text) {
  return text
    .split("\n")
    .map(line => line.replace(/^\d+\.\s*/, "").trim())
    .filter(l => l);
}

function parseKeyValue(text) {
  const obj = {};
  text.split("\n").forEach(line => {
    const [key, value] = line.split(":");
    if (key && value) obj[key.trim()] = value.trim();
  });
  return obj;
}



async function createPPTX(text) {
  const pptx = new pptxgen();
  let slide = pptx.addSlide();
  slide.addText(text, { x: 1, y: 1, fontSize: 18 });
  return await pptx.write("buffer");
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
  };
  const uploadResult = await s3.upload(params).promise();
  return uploadResult.Location;
}

// ---------------- GENERATE DOCUMENT ROUTE ----------------
router.post('/generate-document', authMiddleware, async (req, res) => {
  const { prompt, format, folderName } = req.body;
  try {
    const userId = req.user.id;
    const docText = await generateWithOpenAI(prompt);

    let buffer, mime, ext;

    switch (format) {
      case 'pdf': buffer = await createPDF(docText); mime = 'application/pdf'; ext = 'pdf'; break;
      case 'docx': buffer = await createDOCX(docText); mime = 'application/docx'; ext = 'docx'; break;
      case 'xlsx': buffer = createXLSX(docText); mime = 'application/xlsx'; ext = 'xlsx'; break;
      case 'csv': buffer = createCSV(docText); mime = 'text/csv'; ext = 'csv'; break;
      case 'txt': buffer = createTXT(docText); mime = 'text/plain'; ext = 'txt'; break;
      case 'md': buffer = createMarkdown(docText); mime = 'text/markdown'; ext = 'md'; break;
      case 'json': buffer = createJSON(docText); mime = 'application/json'; ext = 'json'; break;
      case 'pptx': buffer = await createPPTX(docText); mime = 'application/pptx'; ext = 'pptx'; break;
      case 'image': buffer = createImage(); mime = 'image/png'; ext = 'png'; break;
      default: return res.status(400).json({ error: "Unsupported format" });
    }

    const folder = folderName ? folderName.toLowerCase().replace(/ /g, '-') : `${Date.now()}`;
    const filename = `${Date.now()}-${uuidv4()}.${ext}`;

    const fileUrl = await uploadBufferToS3(buffer, userId, folder, filename, mime);

    res.json({ fileUrl, filename, folder, format });

  } catch (err) {
    console.error("Document generation error:", err);
    res.status(500).json({ error: "Document generation failed." });
  }
});

// ---------------- FETCH ALL DOCUMENTS ROUTE ----------------
router.get('/my-documents', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const prefix = `${userId}/document-generation/`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Prefix: prefix
    };

    const s3Objects = await s3.listObjectsV2(params).promise();

    const files = s3Objects.Contents.map(obj => ({
      key: obj.Key,
      url: `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${obj.Key}`,
      filename: obj.Key.split("/").pop(),
      folder: obj.Key.split("/")[2],
      size: obj.Size,
      lastModified: obj.LastModified
    }));

    res.json({ files });

  } catch (err) {
    console.error("Fetch documents error:", err);
    res.status(500).json({ error: "Unable to fetch documents" });
  }
});
// ---------------- DELETE DOCUMENT FROM S3 ----------------
router.delete("/delete-document", authMiddleware, async (req, res) => {
  try {
    const { key } = req.body;

    if (!key) return res.status(400).json({ error: "Missing file key" });

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key
    };

    await s3.deleteObject(params).promise();

    res.json({ success: true, message: "File deleted from S3" });

  } catch (err) {
    console.error("Delete document error:", err);
    res.status(500).json({ error: "Failed to delete file" });
  }
});


module.exports = router;
