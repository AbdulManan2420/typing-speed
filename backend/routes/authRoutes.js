const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

// @route   GET /auth/register
// @desc    Show registration form
router.get('/register', (req, res) => {
  res.render('auth/register', { title: 'Register' });
});

// @route   POST /auth/register
// @desc    Register a new user
router.post('/register', [
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], authController.register);

// @route   GET /auth/login
// @desc    Show login form
router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Login' });
});

// @route   POST /auth/login
// @desc    Login user
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], authController.login);

// @route   GET /auth/logout
// @desc    Logout user
router.get('/logout', authController.logout);

module.exports = router;