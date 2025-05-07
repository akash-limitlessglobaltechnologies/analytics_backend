const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  instanceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FeedbackInstance',
    required: true
  },
  message: {
    type: String,
    required: false,
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: false
  },
  userEmail: {
    type: String,
    required: false,
    trim: true
  },
  name: {
    type: String,
    required: false,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);