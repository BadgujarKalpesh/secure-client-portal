const AuditLog = require('../models/auditLogModel');

const logAction = async (req, action, details = '', userOverride = null) => {
    try {
        // Use userOverride if provided (for login cases), otherwise use req.user
        const user = userOverride || req.user;
        
        if (!user) {
            // Handle cases where user is not available (e.g., failed login)
            const username = req.body?.username || 'Unknown';
            await AuditLog.create(null, username, 'N/A', action, details);
            return;
        }
        
        const { id, username, role } = user;
        await AuditLog.create(id, username, role, action, details);
    } catch (error) {
        console.error('--- FAILED TO WRITE AUDIT LOG ---', error);
    }
};

module.exports = logAction;