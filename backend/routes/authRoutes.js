const express = require('express');
const router = express.Router();
const { 
    loginUser, 
    setupAdminMfa, 
    verifyAndEnableAdminMfa,
    setupViewerMfa,      
    verifyAndEnableViewerMfa 
} = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/login', loginUser);

// Admin MFA Routes
router.get('/mfa/setup', protect, adminOnly, setupAdminMfa);
router.post('/mfa/enable', protect, adminOnly, verifyAndEnableAdminMfa);

// ** NEW - Viewer MFA Routes **
router.get('/mfa/viewer/setup', protect, setupViewerMfa);
router.post('/mfa/viewer/enable', protect, verifyAndEnableViewerMfa);

module.exports = router;