const Client = require('../models/clientModel');
const cloudinary = require('cloudinary').v2;

const createClient = async (req, res) => {
    try {
        // Map frontend camelCase names to backend snake_case names
        const clientData = {
            organisation_name: req.body.organisationName,
            organisation_address: req.body.organisationAddress,
            organisation_domain_id: req.body.organisationDomainId,
            nature_of_business: req.body.natureOfBusiness,
            authorised_signatory_full_name: req.body.authorisedSignatoryFullName,
            authorised_signatory_mobile: req.body.authorisedSignatoryMobile,
            authorised_signatory_email: req.body.authorisedSignatoryEmail,
            authorised_signatory_designation: req.body.authorisedSignatoryDesignation,
            billing_contact_name: req.body.billingContactName,
            billing_contact_number: req.body.billingContactNumber,
            billing_contact_email: req.body.billingContactEmail,
            organisation_type: req.body.organisationType
        };

        let documents = [];
        if (req.files) {
            for (const fieldName in req.files) {
                const fileArray = req.files[fieldName];
                if (fileArray && fileArray.length > 0) {
                    const file = fileArray[0];
                    documents.push({
                        document_type: fieldName, // e.g., 'certificateOfIncorporation'
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
        // You might want to fetch associated documents here as well
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


// Note: A full updateClient function would be more complex, mapping editable fields.
// This is a placeholder for that logic if you need it.
const updateClient = async (req, res) => {
    res.status(501).json({ message: 'Client update not yet implemented.'});
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