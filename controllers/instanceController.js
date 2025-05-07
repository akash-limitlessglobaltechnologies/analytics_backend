const FeedbackInstance = require('../models/feedbackInstance');
const Feedback = require('../models/feedback');
const crypto = require('crypto');

// Generate a random key of 12 characters
const generateRandomKey = () => {
  return crypto.randomBytes(6).toString('hex');
};

// Create a new feedback instance
exports.createFeedbackInstance = async (req, res) => {
  try {
    const { name, key } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Please provide a name for the feedback instance' });
    }

    let instanceKey = key;

    // If key is provided, check if it already exists
    if (instanceKey) {
      const existingInstance = await FeedbackInstance.findOne({ key: instanceKey });
      if (existingInstance) {
        // Generate a new random key if the provided key already exists
        instanceKey = generateRandomKey();
      }
    } else {
      // Generate a random key if none is provided
      instanceKey = generateRandomKey();
    }

    const newInstance = await FeedbackInstance.create({
      name,
      key: instanceKey
    });

    res.status(201).json({
      success: true,
      data: newInstance,
      feedbackUrl: `${req.protocol}://${req.get('host')}/api/feedback/submit/${newInstance.key}`
    });
  } catch (error) {
    console.error("Create instance error:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to create feedback instance',
      error: error.message
    });
  }
};

// Get all feedback instances
exports.getAllInstances = async (req, res) => {
  try {
    const instances = await FeedbackInstance.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: instances.length,
      data: instances
    });
  } catch (error) {
    console.error("Get instances error:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback instances',
      error: error.message
    });
  }
};

// Delete a feedback instance by key
exports.deleteInstance = async (req, res) => {
  try {
    const { key } = req.params;
    
    // Find instance
    const instance = await FeedbackInstance.findOne({ key });
    
    if (!instance) {
      return res.status(404).json({
        success: false,
        message: 'Feedback instance not found'
      });
    }
    
    // Delete all feedback associated with this instance
    await Feedback.deleteMany({ instanceId: instance._id });
    
    // Delete the instance
    await FeedbackInstance.findByIdAndDelete(instance._id);
    
    res.status(200).json({
      success: true,
      message: 'Feedback instance and all associated feedback deleted successfully'
    });
  } catch (error) {
    console.error("Delete instance error:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete feedback instance',
      error: error.message
    });
  }
};