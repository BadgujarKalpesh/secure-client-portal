const express = require('express');
const router = express.Router();
const {
    createClient,
    getAllClients,
    getClientById,
    updateClient,
    deleteClient,
    updateClientStatus,

} = require('../controllers/clientController');
const upload = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

// Apply the 'protect' middleware to all routes in this file
router.use(protect);

router.route('/').post(createClient).get(getAllClients);

// Add the new status update route
router.route('/:id/status').put(updateClientStatus);

router.route('/:id').get(getClientById).put(updateClient).delete(deleteClient);

router.post('/', upload.array('documents', 5), createClient);

// Add document upload route here later
// router.post('/:id/upload', uploadDocument);

module.exports = router;