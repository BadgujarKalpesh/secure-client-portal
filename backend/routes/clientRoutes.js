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
// Import both middleware
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All client routes require a user to be logged in
router.use(protect);

// Routes for creating and getting all clients
router.route('/')
    .post(adminOnly, upload.array('documents', 5), createClient) // Only admins can create
    .get(getAllClients); // Admins and Viewers can get all clients

// Routes for a single client by ID
router.route('/:id')
    .get(getClientById) // Admins and Viewers can get a single client
    .put(adminOnly, updateClient) // Only admins can update
    .delete(adminOnly, deleteClient); // Only admins can delete

// Route for status updates
router.put('/:id/status', adminOnly, updateClientStatus); // Only admins can change status

module.exports = router;