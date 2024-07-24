const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const connectDb = require('./db/connectDb');

const PORT = process.env.PORT || 3001;

const app = express();
connectDb();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ msg: 'health check success' });
});

app.listen(PORT, () => {
  console.log(`express app listening on port ${PORT}`);
});
