require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ===============================
   ✅ CORS CONFIG (FIXED)
================================ */

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",

  "https://athena-ai-theta.vercel.app",
  "https://athena-airc.vercel.app",

  "https://athena-ai-1-5pif.onrender.com" // backend (Render)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman / server-to-server / cron
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

/* ===============================
   ✅ MIDDLEWARE
================================ */

app.use(express.json());

/* ===============================
   ✅ ROUTES
================================ */

const uploadRoutes = require("./routes/upload");
const brandKitRoutes = require("./routes/brandKit");
const generateDocument = require("./routes/generateDocument");
const authRoutes = require("./routes/authRoutes");
const imageRoutes = require("./routes/imageRoutes");
const applyStyleRoutes = require("./routes/applyStyle");
const aiImageRoutes = require("./routes/aiImageRoutes");
const codegenRoutes = require("./routes/codegenRoutes");
const videoRoutes = require("./routes/videoRoutes");
const contentRoutes = require("./routes/contentRoutes");
const logoRoutes = require("./routes/logoRoutes");
const inferenceRoutes = require("./routes/inferenceRoutes");
const userDataRoutes = require("./routes/userDataRoutes");
const profileRoutes = require("./routes/profileRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const emailRoutes = require("./routes/emailRoutes");
const phoneSupport = require("./routes/phoneSupport");
const ppRoutes = require("./routes/pptroutes");
const passwordRoutes = require("./routes/passwordRoutes");
const adminRoutes = require("./routes/adminRoutes");
const templateRoutes = require("./routes/templateRoutes");
const textEnhanceRoutes = require("./routes/textEnhanceRoutes");
const textStyleRoutes = require("./routes/textStyleRoutes");
const teamRoutes = require("./routes/teamRoutes");

/* ===============================
   ✅ ROUTE MOUNTS
================================ */

app.use("/api/upload", uploadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/image", imageRoutes);
app.use("/api", applyStyleRoutes);
app.use("/api/ai-image", aiImageRoutes);
app.use("/api/codegen", codegenRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/content", contentRoutes);
app.use("/api", logoRoutes);
app.use("/api/inference", inferenceRoutes);
app.use("/api/user-data", userDataRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/phone", phoneSupport.router);
app.use("/api", brandKitRoutes);
app.use("/api/pp", ppRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/text-enhance", textEnhanceRoutes);
app.use("/api/text-style", textStyleRoutes);
app.use("/api/team", teamRoutes);
app.use("/api", generateDocument);

/* ===============================
   ✅ DATABASE
================================ */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));

/* ===============================
   ✅ HEALTH CHECK
================================ */

app.get("/", (req, res) => {
  res.send("API is working ✅");
});

/* ===============================
   ✅ START SERVER
================================ */

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);