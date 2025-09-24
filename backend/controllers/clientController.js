const Client = require('../models/clientModel'); // <-- Changed
const cloudinary = require('cloudinary').v2;

const createClient = async (req, res) => {
    try {
        const { ...textData } = req.body;
        let documents = [];

        if (req.files && req.files.length > 0) {
            documents = req.files.map(file => ({
                url: file.path,
                public_id: file.filename
            }));
        }

        const newClient = await Client.create(textData, documents); // <-- Changed
        res.status(201).json(newClient);

    } catch (error) {
        console.error('--- ERROR CREATING CLIENT ---', error);
        res.status(500).json({ message: 'Server error while creating client', error: error.message });
    }
};


const getAllClients = async (req, res) => {
    try {
        const clients = await Client.findAll(); // <-- Changed
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id); // <-- Changed
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateClient = async (req, res) => {
    try {
        const { status, ...updateData } = req.body;
        const client = await Client.update(req.params.id, updateData); // <-- Changed

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update client', error: error.message });
    }
};

const updateClientStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status provided.' });
        }

        const client = await Client.updateStatus(req.params.id, status); // <-- Changed

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id); // <-- Check if exists first
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        await Client.remove(req.params.id); // <-- Changed
        res.status(200).json({ message: 'Client removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createClient,
    getAllClients,
    getClientById,
    updateClient,
    deleteClient,
    updateClientStatus,
};