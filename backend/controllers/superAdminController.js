const Admin = require('../models/adminModel');
const Viewer = require('../models/viewerModel');

const createAdmin = async (req, res) => {
    const { name, username, password } = req.body;
    if (!name || !username || !password) {
        return res.status(400).json({ message: 'Name, username, and password are required.' });
    }
    try {
        const existingAdmin = await Admin.findByUsername(username);
        if (existingAdmin) {
            return res.status(400).json({ message: 'Username is already taken.' });
        }
        const newAdmin = await Admin.create(name, username, password);
        res.status(201).json(newAdmin);
    } catch (error) {
        res.status(500).json({ message: 'Server error while creating admin.' });
    }
};

const createViewer = async (req, res) => {
    const { name, username, password } = req.body;
    if (!name || !username || !password) {
        return res.status(400).json({ message: 'Name, username, and password are required.' });
    }
    try {
        const existingViewer = await Viewer.findByUsername(username);
        if (existingViewer) {
            return res.status(400).json({ message: 'Username is already taken.' });
        }
        const newViewer = await Viewer.create(name, username, password);
        res.status(201).json(newViewer);
    } catch (error) {
        res.status(500).json({ message: 'Server error while creating viewer.' });
    }
};

const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.findAll();
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching admins.' });
    }
};

const getAllViewers = async (req, res) => {
    try {
        const viewers = await Viewer.findAll();
        res.status(200).json(viewers);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching viewers.' });
    }
};

const updateAdmin = async (req, res) => {
    const { id } = req.params;
    const { name, username, password } = req.body;

    if (!name || !username) {
        return res.status(400).json({ message: 'Name and username are required.' });
    }

    try {
        const updatedAdmin = await Admin.update(id, { name, username, password });
        if (!updatedAdmin) {
            return res.status(404).json({ message: 'Admin not found.' });
        }
        res.status(200).json(updatedAdmin);
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating admin.' });
    }
};

const updateViewer = async (req, res) => {
    const { id } = req.params;
    const { name, username, password } = req.body;

    if (!name || !username) {
        return res.status(400).json({ message: 'Name and username are required.' });
    }

    try {
        const updatedViewer = await Viewer.update(id, { name, username, password });
        if (!updatedViewer) {
            return res.status(404).json({ message: 'Viewer not found.' });
        }
        res.status(200).json(updatedViewer);
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating viewer.' });
    }
};

module.exports = {
    createAdmin,
    createViewer,
    getAllAdmins,
    getAllViewers,
    updateAdmin,
    updateViewer,
};