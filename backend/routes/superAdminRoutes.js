const express = require('express');
const router = express.Router();
const { 
    createAdmin, 
    createViewer,
    getAllAdmins,
    getAllViewers,
    updateAdmin,
    updateViewer
} = require('../controllers/superAdminController');
const { protect, superAdminOnly } = require('../middleware/authMiddleware');

// All routes in this file are protected and for super admins only
router.use(protect, superAdminOnly);

// Routes for creating users
router.post('/admins', createAdmin);
router.post('/viewers', createViewer);

// Routes for getting user lists
router.get('/admins', getAllAdmins);
router.get('/viewers', getAllViewers);

// Routes for updating users
router.put('/admins/:id', updateAdmin);
router.put('/viewers/:id', updateViewer);

module.exports = router;