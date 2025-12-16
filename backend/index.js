require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());             // Enable CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  //"https://athena-ai-1-5pif.onrender.com",  // ADD THIS
  "https://athena-ai-theta.vercel.app",
  "http://localhost:5174",
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));



app.use(express.json());     // JSON parsing

// ✅ Import routes
const uploadRoutes = require('./routes/upload');
const brandKitRoutes = require('./routes/brandKit');

// In backend/app.js or backend/server.js
const generateDocument = require('./routes/generateDocument');
app.use('/api', generateDocument);


const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');
const applyStyleRoutes = require('./routes/applyStyle');
const aiImageRoutes = require('./routes/aiImageRoutes');
const codegenRoutes = require('./routes/codegenRoutes');
const videoRoutes = require('./routes/videoRoutes');
const contentRoutes = require('./routes/contentRoutes');
const logoRoutes = require('./routes/logoRoutes');
const inferenceRoutes = require('./routes/inferenceRoutes');
const userDataRoutes = require('./routes/userDataRoutes');
const profileRoutes = require('./routes/profileRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const emailRoutes = require('./routes/emailRoutes');
const phoneSupport = require("./routes/phoneSupport");
const ppRoutes = require('./routes/pptroutes');

const passwordRoutes = require('./routes/passwordRoutes');
app.use('/api/password', passwordRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

const templateRoutes = require('./routes/templateRoutes');
app.use('/api/templates', templateRoutes);

const textEnhanceRoutes = require('./routes/textEnhanceRoutes');
app.use('/api/text-enhance', textEnhanceRoutes);


// ✅ Mount routes
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/image', imageRoutes);
app.use('/api', applyStyleRoutes);
app.use('/api/ai-image', aiImageRoutes);
app.use('/api/codegen', codegenRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/content', contentRoutes);
app.use('/api', logoRoutes);
app.use('/api/inference', inferenceRoutes);
app.use('/api/user-data', userDataRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/phone', phoneSupport.router);
app.use('/api', brandKitRoutes);
app.use('/api/pp', ppRoutes);



// ✅ MongoDB connection
const teamRoutes = require('./routes/teamRoutes');
app.use('/api/team', teamRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err.message));

// ✅ Base route
app.get('/', (req, res) => res.send('API is working ✅'));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

