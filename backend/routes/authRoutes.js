const express = require('express');
const { check, validationResult } = require('express-validator');
const { loginUser, registerUser, getCurrentUser } = require('../controllers/authController');
const router = express.Router();

// Signup route 
router.post('/register', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], registerUser);

// Login route 
router.post('/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], loginUser);

// Get current user
router.get('/me', getCurrentUser);

module.exports = router;