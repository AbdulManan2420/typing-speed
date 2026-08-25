const express = require('express');
const { authenticate } = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = express.Router();

// @route   GET /users/dashboard
// @desc    Get user dashboard
router.get('/dashboard', authenticate, userController.getDashboard);

module.exports = router;