const express = require('express');
const router = express.Router();
const {
    createClient,
    getAllClients,
    getClientById,
    updateClient,
    deleteClient,
    updateClientStatus,
    getClientDocuments,
    viewClientDocument,
    streamClientDocument
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

// Helper to handle Multer errors cleanly
const uploadWithErrorsHandled = (req, res, next) => {
    upload.fields(documentUploadFields)(req, res, function (err) {
        if (!err) return next();
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ message: 'File too large. Max 20MB per file.' });
        }
        return res.status(400).json({ message: err.message || 'Upload failed.' });
    });
};

router.route('/')
    .post(adminOnly, uploadWithErrorsHandled, createClient)
    .get(getAllClients);

router.route('/:id')
    .get(getClientById)
    .put(adminOnly, uploadWithErrorsHandled, updateClient) // if updating files also
    .delete(adminOnly, deleteClient);

router.put('/:id/status', updateClientStatus);

router.get('/:id/documents', getClientDocuments);
router.get('/:id/documents/:docId/view', viewClientDocument);
router.get('/documents/:docId/view', protect, mfaEnabled, streamClientDocument);

module.exports = router;