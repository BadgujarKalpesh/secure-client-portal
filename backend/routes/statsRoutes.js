const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');
const { protect, adminOnly, mfaEnabled } = require('../middleware/authMiddleware');

// Only logged-in admins with MFA can access stats
router.get('/', protect, adminOnly, mfaEnabled, getStats);

module.exports = router;