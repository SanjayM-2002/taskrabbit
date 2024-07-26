const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDb = require('./db/connectDb');
const cloudinary = require('cloudinary').v2;
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

const PORT = process.env.PORT || 3001;

const app = express();
connectDb();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.get('/health', (req, res) => {
  res.status(200).json({ msg: 'health check success' });
});
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`express app listening on port ${PORT}`);
});
