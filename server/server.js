const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Load environment configurations
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Body parser & Cookie Parser
app.use(express.json());
app.use(cookieParser());

// CORS Configurations
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true, // Allow cookies over CORS
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Simple ping route to warm up Render service
app.get('/api/ping', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is active and warm!' });
});

// Import Router mappings
const authRoutes = require('./routes/authRoutes');
const presentationRoutes = require('./routes/presentationRoutes');
const generationRoutes = require('./routes/generationRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/presentations', presentationRoutes);
app.use('/api/generation', generationRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

// Listen to port
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 AI Presentation Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err, promise) => {
  console.error(`❌ Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
