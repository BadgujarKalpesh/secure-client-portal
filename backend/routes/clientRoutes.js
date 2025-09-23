const express = require('express');
const router = express.Router();
const {
    createClient,
    getAllClients,
    getClientById,
    updateClient,
    deleteClient,
} = require('../controllers/clientController');
const { protect } = require('../middleware/authMiddleware');

// Apply the 'protect' middleware to all routes in this file
router.use(protect);

router.route('/').post(createClient).get(getAllClients);
router.route('/:id').get(getClientById).put(updateClient).delete(deleteClient);

// Add document upload route here later
// router.post('/:id/upload', uploadDocument);

module.exports = router;