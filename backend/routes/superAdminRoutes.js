const express = require('express');
const router = express.Router();
const { createAdmin, createViewer } = require('../controllers/superAdminController');
const { protect, superAdminOnly } = require('../middleware/authMiddleware');

// All routes in this file are protected and for super admins only
router.use(protect, superAdminOnly);

// Route to create a new admin
router.post('/admins', createAdmin);

// Route to create a new viewer
router.post('/viewers', createViewer);

module.exports = router;