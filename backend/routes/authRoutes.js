const express = require('express');
const router = express.Router();
const { 
    loginUser, 
    setupAdminMfa, 
    verifyAndEnableAdminMfa,
    setupViewerMfa,      
    verifyAndEnableViewerMfa,
    setupSuperAdminMfa,
    verifyAndEnableSuperAdminMfa
} = require('../controllers/authController');

const { protect, adminOnly, superAdminOnly } = require('../middleware/authMiddleware');

router.post('/login', loginUser);

// Public key for credential encryption
const { getPublicKey } = require('../config/crypto');
router.get('/public-key', (req, res) => {
    res.status(200).json({ publicKey: getPublicKey() });
});

// Admin MFA Routes
router.get('/mfa/setup', protect, adminOnly, setupAdminMfa);
router.post('/mfa/enable', protect, adminOnly, verifyAndEnableAdminMfa);

// Viewer MFA Routes
router.get('/mfa/viewer/setup', protect, setupViewerMfa);
router.post('/mfa/viewer/enable', protect, verifyAndEnableViewerMfa);

// Super Admin MFA Routes
router.get('/mfa/superadmin/setup', protect, superAdminOnly, setupSuperAdminMfa);
router.post('/mfa/superadmin/enable', protect, superAdminOnly, verifyAndEnableSuperAdminMfa);

module.exports = router;