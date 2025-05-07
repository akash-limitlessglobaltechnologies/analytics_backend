const mongoose = require('mongoose');

const feedbackInstanceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide an instance name'],
    trim: true
  },
  key: {
    type: String,
    required: [true, 'Key is required'],
    unique: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FeedbackInstance', feedbackInstanceSchema);