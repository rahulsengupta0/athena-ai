require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// app.use(cors());             // Enable CORS
app.use(cors({
  origin: "http://localhost:5173",  // Frontend origin
  credentials: true,                // Allow credentials (cookies, auth headers)
}));

app.use(express.json());     // JSON parsing

// aws test
const uploadRoutes = require('./routes/upload');
app.use('/api/upload', uploadRoutes);

const brandKitRoutes = require('./routes/brandKit');
app.use('/api', brandKitRoutes);



const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes );

const imageRoutes = require('./routes/imageRoutes');
app.use('/api/image', imageRoutes);

const applyStyleRoutes = require('./routes/applyStyle');
app.use('/api', applyStyleRoutes);


const aiImageRoutes = require('./routes/aiImageRoutes');
app.use('/api/ai-image', aiImageRoutes);

const codegenRoutes = require('./routes/codegenRoutes');
app.use('/api/codegen', codegenRoutes);

const videoRoutes = require("./routes/videoRoutes");
app.use("/api/video", videoRoutes);

const contentRoutes = require('./routes/contentRoutes');
app.use('/api/content', contentRoutes);

const logoRoutes = require('./routes/logoRoutes'); // add this line
app.use('/api', logoRoutes); // add this line

// Import your inference routes
const inferenceRoutes = require('./routes/inferenceRoutes');
app.use('/api/inference', inferenceRoutes);

const userDataRoutes = require('./routes/userDataRoutes');
app.use('/api/user-data', userDataRoutes);

const profileRoutes = require('./routes/profileRoutes');
app.use('/api/profile', profileRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(console.error);

app.get('/', (req, res) => res.send('API is working'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const deepseekRoutes = require("./routes/deepseekRoutes");
app.use("/api", deepseekRoutes);
