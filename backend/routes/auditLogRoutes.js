const express = require('express');
const router = express.Router();
const { getAllLogs } = require('../controllers/auditLogController');
const { protect, superAdminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, superAdminOnly, getAllLogs);

module.exports = router;