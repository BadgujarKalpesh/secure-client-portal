const Viewer = require('../models/viewerModel');

const createViewer = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        const existingViewer = await Viewer.findByUsername(username);
        if (existingViewer) {
            return res.status(400).json({ message: 'Username is already taken.' });
        }
        const newViewer = await Viewer.create(username, password);
        res.status(201).json(newViewer);
    } catch (error) {
        console.error("Error creating viewer:", error);
        res.status(500).json({ message: 'Server error while creating viewer.' });
    }
};

const getAllViewers = async (req, res) => {
    try {
        const viewers = await Viewer.findAll();
        res.status(200).json(viewers);
    } catch (error) {
        console.error("Error fetching viewers:", error);
        res.status(500).json({ message: 'Server error while fetching viewers.' });
    }
};

module.exports = {
    createViewer,
    getAllViewers,
};