const AuditLog = require('../models/auditLogModel');

const logAction = async (req, action, details = '', userOverride = null) => {
    try {
        // Determine client IP (supports proxies via X-Forwarded-For)
        const forwardedFor = req.headers && req.headers['x-forwarded-for'];
        const ip = Array.isArray(forwardedFor)
            ? forwardedFor[0]
            : (forwardedFor ? String(forwardedFor).split(',')[0].trim() : null)
            || req.ip
            || (req.connection && req.connection.remoteAddress)
            || (req.socket && req.socket.remoteAddress)
            || 'Unknown IP';

        // Append IP to details so it shows in the existing Audit Trail
        const detailsWithIp = details && details.length > 0 ? `${details} (IP: ${ip})` : `IP: ${ip}`;

        // Use userOverride if provided (for login cases), otherwise use req.user
        const user = userOverride || req.user;
        
        if (!user) {
            // Handle cases where user is not available (e.g., failed login)
            const username = (req.body && req.body.username) ? req.body.username : 'Unknown';
            await AuditLog.create(null, username, 'N/A', action, detailsWithIp);
            return;
        }
        
        const { id, username, role } = user;
        await AuditLog.create(id, username, role, action, detailsWithIp);
    } catch (error) {
        console.error('--- FAILED TO WRITE AUDIT LOG ---', error);
    }
};

module.exports = logAction;