const Feedback = require('../models/feedback');
const FeedbackInstance = require('../models/feedbackInstance');

// Submit feedback for a specific instance
exports.submitFeedback = async (req, res) => {
  try {
    const { key } = req.params;
    const { message, rating, userEmail, name } = req.body;

    // Find the instance by key
    const instance = await FeedbackInstance.findOne({ key });
    
    if (!instance) {
      return res.status(404).json({
        success: false,
        message: 'Feedback instance not found. Please check the key.'
      });
    }

    // Create the feedback - all fields are optional
    const feedback = await Feedback.create({
      instanceId: instance._id,
      message,
      rating,
      userEmail,
      name
    });

    res.status(201).json({
      success: true,
      data: feedback,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error("Submit feedback error:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error.message
    });
  }
};

// Get all feedback for a specific instance by key
exports.getFeedbackByInstanceKey = async (req, res) => {
  try {
    const { key } = req.params;
    
    // Find the instance by key
    const instance = await FeedbackInstance.findOne({ key });
    
    if (!instance) {
      return res.status(404).json({
        success: false,
        message: 'Feedback instance not found. Please check the key.'
      });
    }
    
    // Get all feedback for this instance
    const feedback = await Feedback.find({ instanceId: instance._id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      instanceName: instance.name,
      count: feedback.length,
      data: feedback
    });
  } catch (error) {
    console.error("Get feedback error:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
};