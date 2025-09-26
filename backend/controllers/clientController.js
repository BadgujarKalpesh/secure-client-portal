const Client = require('../models/clientModel');
const cloudinary = require('cloudinary').v2;

const createClient = async (req, res) => {
    try {
        // **FIX:** The keys in this object MUST be camelCase to match the model
        const clientData = {
            organisationName: req.body.organisationName,
            organisationAddress: req.body.organisationAddress,
            organisationDomainId: req.body.organisationDomainId,
            natureOfBusiness: req.body.natureOfBusiness,
            authorisedSignatoryFullName: req.body.authorisedSignatoryFullName,
            authorisedSignatoryMobile: req.body.authorisedSignatoryMobile,
            authorisedSignatoryEmail: req.body.authorisedSignatoryEmail,
            authorisedSignatoryDesignation: req.body.authorisedSignatoryDesignation,
            billingContactName: req.body.billingContactName,
            billingContactNumber: req.body.billingContactNumber,
            billingContactEmail: req.body.billingContactEmail,
            organisationType: req.body.organisationType
        };

        let documents = [];
        if (req.files) {
            for (const fieldName in req.files) {
                const fileArray = req.files[fieldName];
                if (fileArray && fileArray.length > 0) {
                    const file = fileArray[0];
                    console.log("fieldName : ", fieldName);
                    documents.push({
                        document_type: fieldName,
                        url: file.path,
                        public_id: file.filename
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

module.exports = {
    createClient,
    getAllClients,
    getClientById,
    updateClient,
    deleteClient,
    updateClientStatus,
};