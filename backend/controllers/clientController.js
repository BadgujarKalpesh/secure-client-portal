const Client = require('../models/clientModel');
const cloudinary = require('cloudinary').v2;
const https = require('https');
const logAction = require('../utils/auditLogger');


const createClient = async (req, res) => {
    try {
        const clientData = req.body;
        const documentIds = JSON.parse(req.body.documentIds || '{}');

        let documents = [];
        if (req.files) {
            for (const fieldName in req.files) {
                const fileArray = req.files[fieldName];
                if (fileArray && fileArray.length > 0) {
                    const file = fileArray[0];
                    const uniqueId = documentIds[fieldName + 'Id'];

                    if (!uniqueId && fieldName !== 'boardResolution') {
                        return res.status(400).json({ message: `Document ID for ${fieldName} is required.` });
                    }

                    documents.push({
                        document_type: fieldName,
                        url: (file.path || '').replace('http://', 'https://'),
                        public_id: file.filename,
                        document_unique_id: uniqueId || 'N/A'
                    });
                }
            }
        }
        
        const newClient = await Client.create(clientData, documents);
        await logAction(req, 'CREATE_CLIENT', `Created new client ID ${newClient.customer_id} (${newClient.organisation_name})`);

        res.status(201).json(newClient);

    } catch (error) {
        console.error('--- ERROR CREATING CLIENT ---', error);
        res.status(500).json({ message: 'Server error while creating client', error: error.message });
    }
};

const getAllClients = async (req, res) => {
    try {
        const clients = await Client.findAll();
        res.status(200).json(clients);
    } catch (error) {
        console.error('Error fetching all clients:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        await logAction(req, 'VIEW_CLIENT', `Viewed details for client ID ${client.customer_id}`);

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(client);
    } catch (error) {
        console.error(`Error fetching client ${req.params.id}:`, error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateClientStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status provided.' });
        }

        const client = await Client.updateStatus(req.params.id, status);
        await logAction(req, 'UPDATE_CLIENT_STATUS', `Set status to "${status}" for client ID ${client.customer_id}`);

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(client);
    } catch (error) {
        console.error(`Error updating status for client ${req.params.id}:`, error);
        res.status(500).json({ message: 'Server Error' });
    }
};


const updateClient = async (req, res) => {
    try {
        const updatedClient = await Client.update(req.params.id, req.body);
        await logAction(req, 'UPDATE_CLIENT', `Updated details for client ID ${updatedClient.customer_id}`);

        if (!updatedClient) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(updatedClient);
    } catch (error) {
        console.error(`Error updating client ${req.params.id}:`, error);
        res.status(500).json({ message: 'Server Error' });
    }
}

const deleteClient = async (req, res) => {
     res.status(501).json({ message: 'Client delete not yet implemented.'});
}

const getClientDocuments = async (req, res) => {
    try {
        const documents = await Client.findDocsById(req.params.id);
        // Remove sensitive URL and public_id from the response
        const sanitizedDocuments = documents.map(doc => ({
            id: doc.id,
            client_id: doc.client_id,
            document_type: doc.document_type,
            created_at: doc.created_at,
            document_unique_id: doc.document_unique_id
        }));
        res.status(200).json(sanitizedDocuments);
    } catch (error) {
        console.error(`Error fetching documents for client ${req.params.id}:`, error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const viewClientDocument = async (req, res) => {
    try {
        const clientId = req.params.id;
        const docId = req.params.docId;
        const doc = await Client.findDocByDocId(docId);

        if (!doc || String(doc.client_id) !== String(clientId)) {
            return res.status(404).json({ message: 'Document not found' });
        }

        const publicId = doc.public_id; // e.g., 'kyc_documents/xyz123'
        const url = cloudinary.url(publicId, {
            resource_type: 'auto',
            type: 'upload',
            secure: true,
            format: 'pdf',
        });

        // Let the browser/axios follow to Cloudinary
        return res.redirect(302, url);
    } catch (error) {
        console.error('Error preparing document for view:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const streamClientDocument = async (req, res) => {
    try {
        const { docId } = req.params;
        const document = await Client.findDocumentById(docId);

        if (!document || !document.url) {
            return res.status(404).json({ message: 'Document not found' });
        }

        await logAction(req, 'VIEW_DOCUMENT', `Viewed document ID ${docId} for client ID ${document.client_id}`);

        https.get(document.url, (upstream) => {
            const ctype = upstream.headers['content-type'] || 'application/octet-stream';
            const clen  = upstream.headers['content-length'];
            res.setHeader('Content-Type', ctype);
            if (clen) res.setHeader('Content-Length', clen);
            res.setHeader('Cache-Control', 'private, max-age=0');
            res.setHeader('Content-Disposition', 'inline; filename="document"');

            upstream.pipe(res);
        }).on('error', (e) => {
            console.error('Error fetching from Cloudinary:', e);
            res.status(502).json({ message: 'Failed to fetch the document.' });
        });

    } catch (error) {
        console.error('Error streaming document:', error);
        res.status(500).json({ message: 'Server error while streaming document.' });
    }
};



module.exports = {
    createClient,
    getAllClients,
    getClientById,
    updateClient,
    deleteClient,
    updateClientStatus,
    getClientDocuments,
    viewClientDocument,
    streamClientDocument
};