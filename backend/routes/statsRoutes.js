const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');
const { protect, mfaEnabled } = require('../middleware/authMiddleware');

// REMOVED adminOnly: Now all authenticated users with MFA can access this route
router.get('/', protect, mfaEnabled, getStats);

module.exports = router;