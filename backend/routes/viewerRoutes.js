const express = require('express');
const router = express.Router();
const { createViewer, getAllViewers, updateViewer } = require('../controllers/viewerController');
const { protect, adminOnly, mfaEnabled } = require('../middleware/authMiddleware');

router.use(protect, adminOnly, mfaEnabled);

router.route('/')
    .post(createViewer)
    .get(getAllViewers);

// ** NEW ROUTE for updating a specific viewer by ID **
router.put('/:id', updateViewer);

module.exports = router;