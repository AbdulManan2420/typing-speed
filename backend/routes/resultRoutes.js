const express = require('express');
const { authenticate } = require('../middleware/auth');
const resultController = require('../controllers/resultController');

const router = express.Router();

// @route   POST /results
// @desc    Save typing test result
router.post('/', authenticate, resultController.saveResult);

// @route   GET /results/history
// @desc    Get user's typing test history
router.get('/history', authenticate, resultController.getUserResults);

module.exports = router;