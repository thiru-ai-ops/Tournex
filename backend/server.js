require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const apiRoutes = require('./routes');

// Trigger Firebase initialization
require('./config/firebase');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Request logging in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health Check / Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ONLINE',
      version: '2.0.0'
    },
    message: 'Welcome to the TourNex Firebase API Gateway.'
  });
});

app.get("/api/test", (req, res) => {
  res.json({ 
    success: true, 
    data: { message: "Backend connected successfully 🚀" },
    message: "Test connection successful"
  });
});

// API Routes mount
app.use('/api', apiRoutes);

// 404 Route handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
