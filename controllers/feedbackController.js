const Feedback = require('../models/feedback');
const FeedbackInstance = require('../models/feedbackInstance');
const axios = require('axios'); // Add axios for HTTP requests

// Slack webhook URL
const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';

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

    // Send notification to Slack
    try {
      // Format the stars based on rating
      const stars = rating ? '⭐'.repeat(Math.min(rating, 5)) : 'Not provided';
      
      // Create the slack message
      const slackMessage = {
        text: `*New Feedback Received*`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*New Feedback Received*`
            }
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Instance:*\n${instance.name}`
              },
              {
                type: "mrkdwn",
                text: `*Rating:*\n${stars}`
              },
              {
                type: "mrkdwn",
                text: `*From:*\n${name || 'Anonymous'}${userEmail ? ` (${userEmail})` : ''}`
              },
              {
                type: "mrkdwn",
                text: `*Date:*\n${new Date().toLocaleString()}`
              }
            ]
          }
        ]
      };

      // Add message if provided
      if (message) {
        slackMessage.blocks.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Message:*\n${message}`
          }
        });
      }

      // Send to Slack
      await axios.post(SLACK_WEBHOOK_URL, slackMessage);
    } catch (slackError) {
      // Just log the error but don't fail the request
      console.error("Error sending to Slack:", slackError.message);
    }
    
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