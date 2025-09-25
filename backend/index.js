require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());             // Enable CORS
app.use(express.json());     // JSON parsing
const imageRoutes = require('./routes/imageRoutes');
app.use('/api/image', imageRoutes);

const videoRoutes = require("./routes/videoRoutes");
app.use("/api/video", videoRoutes);

const logoRoutes = require('./routes/logoRoutes'); // add this line
app.use('/api', logoRoutes); // add this line

// Import your inference routes
const inferenceRoutes = require('./routes/inferenceRoutes');
app.use('/api/inference', inferenceRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(console.error);

app.get('/', (req, res) => res.send('API is working'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
