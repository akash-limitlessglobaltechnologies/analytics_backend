const express = require('express');
const router = express.Router();

// Import controllers
const instanceController = require('../controllers/instanceController');
const feedbackController = require('../controllers/feedbackController');

// Instance routes
router.post('/instance', instanceController.createFeedbackInstance);
router.get('/instances', instanceController.getAllInstances);
router.delete('/instance/:key', instanceController.deleteInstance);

// Feedback submission routes
router.post('/submit/:key', feedbackController.submitFeedback);
router.get('/feedbacks/:key', feedbackController.getFeedbackByInstanceKey);

module.exports = router;