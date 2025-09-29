const Client = require('../models/clientModel');
const cloudinary = require('cloudinary').v2;
const https = require('https');

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
                        url: (file.path || '')
                            .replace('http://', 'https://')
                            .replace(/\/image\/upload\/(.*\.pdf)$/i, '/raw/upload/$1'),
                        public_id: file.filename,
                        document_unique_id: uniqueId || 'N/A'
                    });
                }
            }
        }
        
        const newClient = await Client.create(clientData, documents);
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
        const normalized = documents.map(d => {
            let url = (d.url || '').replace('http://', 'https://');
            return { ...d, url };
        });
        res.status(200).json(normalized);
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

        // Set the correct content type for the response
        res.setHeader('Content-Type', 'application/pdf');

        // Securely fetch the document from Cloudinary's URL and pipe it to the response
        https.get(document.url, (stream) => {
            stream.pipe(res);
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