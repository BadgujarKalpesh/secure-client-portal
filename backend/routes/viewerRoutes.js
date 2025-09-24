const express = require('express');
const router = express.Router();
const { createViewer, getAllViewers } = require('../controllers/viewerController');
const { protect } = require('../middleware/authMiddleware');

// All routes in this file are protected and can only be accessed by a logged-in admin
router.use(protect);

router.route('/')
    .post(createViewer)
    .get(getAllViewers);

module.exports = router;