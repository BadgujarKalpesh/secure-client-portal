const express = require('express');
const router = express.Router();
const {
    createAccountManager,
    getAllAccountManagers,
    updateAccountManager,
} = require('../controllers/accountManagerController');
const { protect, superAdminOnly, adminOrSuperAdmin } = require('../middleware/authMiddleware');

// Use specific middleware for each route
router.route('/')
    .post(protect, superAdminOnly, createAccountManager)
    .get(protect, adminOrSuperAdmin, getAllAccountManagers); // <-- Admins and Super Admins can get the list

router.route('/:id')
    .put(protect, superAdminOnly, updateAccountManager);

module.exports = router;