const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Initialize app
const app = express();

// Connect to database
connectDB();

// Middleware - Open CORS for any origin
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const feedbackRoutes = require('./routes/feedbackRoutes');

// Mount routes
app.use('/api/feedback', feedbackRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Feedback API' });
});

// For local development
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export the Express API for Vercel
module.exports = app;