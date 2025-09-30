const AuditLog = require('../models/auditLogModel');

const getAllLogs = async (req, res) => {
    try {
        const logs = await AuditLog.findAll();
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching audit logs.' });
    }
};

module.exports = {
    getAllLogs,
};