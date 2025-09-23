const express = require('express');
const router = express.Router();
const { loginAdmin, setupMfa, verifyAndEnableMfa } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// @desc    Authenticate admin & get token (handles password and MFA token)
// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginAdmin);

// @desc    Generate a secret and QR code for MFA setup
// @route   GET /api/auth/mfa/setup
// @access  Private
router.get('/mfa/setup', protect, setupMfa);

// @desc    Verify the token and enable MFA for the user
// @route   POST /api/auth/mfa/enable
// @access  Private
router.post('/mfa/enable', protect, verifyAndEnableMfa);


module.exports = router;