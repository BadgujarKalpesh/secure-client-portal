const AccountManager = require('../models/accountManagerModel');

const createAccountManager = async (req, res) => {
    const { name, email, contactNumber } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required.' });
    }
    try {
        const newAccountManager = await AccountManager.create(name, email, contactNumber);
        res.status(201).json(newAccountManager);
    } catch (error) {
        res.status(500).json({ message: 'Server error while creating account manager.' });
    }
};

const getAllAccountManagers = async (req, res) => {
    try {
        const accountManagers = await AccountManager.findAll();
        res.status(200).json(accountManagers);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching account managers.' });
    }
};

const updateAccountManager = async (req, res) => {
    const { id } = req.params;
    const { name, email, contact_number } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required.' });
    }

    try {
        const updatedAccountManager = await AccountManager.update(id, { name, email, contact_number });
        if (!updatedAccountManager) {
            return res.status(404).json({ message: 'Account Manager not found.' });
        }
        res.status(200).json(updatedAccountManager);
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating account manager.' });
    }
};

module.exports = {
    createAccountManager,
    getAllAccountManagers,
    updateAccountManager,
};