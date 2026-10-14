const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files (HTML, CSS, JS, Assets)
app.use(express.static(path.join(__dirname, '..')));

// Routes Mounting
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    message: '🌸 Pink Basket API Backend is running!',
    database: 'MongoDB',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🌸 Pink Basket Backend Server is running!`);
  console.log(`🚀 Server URL: http://localhost:${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🍃 MongoDB Compass URI: mongodb://127.0.0.1:27017/pink_basket`);
  console.log(`====================================================`);
});
