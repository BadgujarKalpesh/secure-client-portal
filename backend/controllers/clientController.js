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
                        url: (file.path || '').replace('http://', 'https://'),
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

// const streamClientDocument = async (req, res) => {
// 	try {
// 		const { docId } = req.params;
// 		const document = await Client.findDocumentById(docId);
// 		if (!document) return res.status(404).json({ message: 'Document not found' });

// 		const publicId = document.public_id;

// 		// Candidate URLs
// 		const candidates = [];
// 		if (document.url) {
// 			const normalized = (document.url || '').replace('http://', 'https://');
// 			candidates.push(normalized);
// 		}

// 		// ✅ Always try auto first
// 		candidates.push(
// 			cloudinary.url(publicId, { resource_type: 'auto',  type: 'upload', secure: true }),
// 			cloudinary.url(publicId, { resource_type: 'image', type: 'upload', secure: true, format: 'pdf' }),
// 			cloudinary.url(publicId, { resource_type: 'raw',   type: 'upload', secure: true })
// 		);

// 		const fetchAndPipe = (targetUrl, redirectCount = 0, next) => {
// 			if (redirectCount > 5) return next(new Error('Too many redirects'));
// 			const u = new URL(targetUrl);
// 			const mod = u.protocol === 'https:' ? require('https') : require('http');

// 			const reqCloud = mod.get(targetUrl, { headers: { Accept: 'application/pdf,*/*' } }, (cloudRes) => {
// 				if ([301,302,303,307,308].includes(cloudRes.statusCode || 0)) {
// 					const loc = cloudRes.headers.location;
// 					if (!loc) return next(new Error('Redirect without location'));
// 					return fetchAndPipe(new URL(loc, targetUrl).toString(), redirectCount + 1, next);
// 				}
// 				if ((cloudRes.statusCode || 0) !== 200) return next(new Error(String(cloudRes.statusCode)));

// 				const ctype = cloudRes.headers['content-type'] || 'application/pdf';
// 				const clen  = cloudRes.headers['content-length'];
// 				res.setHeader('Content-Type', ctype);
// 				if (clen) res.setHeader('Content-Length', clen);
// 				res.setHeader('Cache-Control', 'private, max-age=0');
// 				res.setHeader('Content-Disposition', 'inline; filename="document.pdf"');
// 				cloudRes.pipe(res);
// 			});
// 			reqCloud.on('error', () => next(new Error('fetch error')));
// 		};

// 		let idx = 0;
// 		const tryNext = () => {
// 			if (idx >= candidates.length) {
// 				return res.status(502).json({ message: 'Could not fetch document from host.' });
// 			}
// 			const url = candidates[idx++];
// 			fetchAndPipe(url, 0, () => tryNext());
// 		};
// 		tryNext();
// 	} catch (error) {
// 		console.error('Error streaming document:', error);
// 		res.status(500).json({ message: 'Server error while streaming document.' });
// 	}
// };

const streamClientDocument = async (req, res) => {
    try {
        const { docId } = req.params;
        const document = await Client.findDocumentById(docId);

        if (!document || !document.url) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.setHeader('Content-Type', 'application/pdf');

        // Securely fetch the document from Cloudinary's URL on the server-side
        // and pipe (stream) it directly to the client's browser.
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