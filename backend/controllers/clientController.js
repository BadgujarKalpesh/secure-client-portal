const Client = require('../models/ClientSchema');

// @desc    Create a new client
const createClient = async (req, res) => {
    try {
        // Text fields are in req.body
        const clientData = { ...req.body };

        // Uploaded file info is in req.files
        if (req.files) {
            clientData.documents = req.files.map(file => ({
                url: file.path, // The secure URL from Cloudinary
                public_id: file.filename // The public ID from Cloudinary
            }));
        }

        const newClient = new Client(clientData);
        await newClient.save();

        res.status(201).json(newClient);
    } catch (error) {
        res.status(400).json({ message: 'Error creating client', error: error.message });
    }
};

// @desc    Get all clients
const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find({});
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get a single client by ID
const getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a client's information
const updateClient = async (req, res) => {
    try {
        // Exclude status from this update to handle it separately
        const { status, ...updateData } = req.body;

        const client = await Client.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update client', error: error.message });
    }
};

// @desc    Update a client's status (Approve/Reject)
const updateClientStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status provided.' });
        }

        const client = await Client.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a client
const deleteClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json({ message: 'Client removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// NOTE: Add your uploadDocument controller here later using multer and cloudinary

module.exports = {
    createClient,
    getAllClients,
    getClientById,
    updateClient,
    deleteClient,
    updateClientStatus, 
};