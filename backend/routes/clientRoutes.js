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
const { protect, adminOnly, mfaEnabled } = require('../middleware/authMiddleware');

router.use(protect, mfaEnabled);

router.route('/')
    .post(adminOnly, upload.array('documents', 5), createClient)
    .get(getAllClients);

router.route('/:id')
    .get(getClientById)
    .put(adminOnly, updateClient)
    .delete(adminOnly, deleteClient);

// ** CHANGED: Removed adminOnly so viewers can also update status **
router.put('/:id/status', updateClientStatus);

module.exports = router;