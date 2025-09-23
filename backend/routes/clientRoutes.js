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

// Apply authentication middleware to all client routes
router.use(protect);

// --- NEW, SIMPLIFIED ROUTE DEFINITIONS ---

// GET /api/clients - Fetches all clients
router.route('/')
    .post(upload.array('documents', 5), createClient) // This line is crucial
    .get(getAllClients);
// This handles status updates for a specific client
router.put('/:id/status', updateClientStatus);

// These routes handle actions for a single client by their ID
router.get('/:id', getClientById);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

module.exports = router;