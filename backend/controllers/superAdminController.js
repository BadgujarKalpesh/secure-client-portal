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

module.exports = {
    createAdmin,
    createViewer,
};