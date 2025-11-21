require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ✅ CORS setup (your frontend origin)
app.use(cors({
  origin: "http://localhost:5173", // frontend
  credentials: true,
}));

// ✅ JSON parsing
app.use(express.json());

// ✅ Import routes
const uploadRoutes = require('./routes/upload');
const brandKitRoutes = require('./routes/brandKit');
app.use('/api', brandKitRoutes);

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
const deepseekRoutes = require('./routes/deepseekRoutes');
const emailRoutes = require('./routes/emailRoutes');
const phoneSupport = require("./routes/phoneSupport");



// ✅ Mount routes
app.use('/api/upload', uploadRoutes);
app.use('/api', brandKitRoutes);
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
app.use('/api/deepseek', deepseekRoutes); 
app.use('/api/email', emailRoutes);
app.use('/api/phone', phoneSupport.router);



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

