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

// Define the fields that will be uploaded
const documentUploadFields = [
    { name: 'certificateOfIncorporation', maxCount: 1 },
    { name: 'gstCertificate', maxCount: 1 },
    { name: 'panCard', maxCount: 1 },
    { name: 'officeProof', maxCount: 1 },
    { name: 'utilityBill', maxCount: 1 },
    { name: 'signatoryLetter', maxCount: 1 },
    { name: 'boardResolution', maxCount: 1 }
];

router.route('/')
    .post(adminOnly, upload.fields(documentUploadFields), createClient)
    .get(getAllClients);

router.route('/:id')
    .get(getClientById)
    .put(adminOnly, updateClient)
    .delete(adminOnly, deleteClient);

router.put('/:id/status', updateClientStatus);

router.get('/:id/documents', getClientDocuments); 

module.exports = router;