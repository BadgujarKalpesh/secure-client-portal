const { pool } = require('../config/db');

const getStats = async (req, res) => {
    try {
        let stats = {};

        if (req.user.role === 'superAdmin') {
            const adminStatsQuery = 'SELECT COUNT(*) AS total FROM admins';
            const adminStatsResult = await pool.query(adminStatsQuery);
            stats.admins = adminStatsResult.rows[0];

            const viewerStatsQuery = 'SELECT COUNT(*) AS total FROM viewers';
            const viewerStatsResult = await pool.query(viewerStatsQuery);
            stats.viewers = viewerStatsResult.rows[0];
        } else {
            const clientStatsQuery = `
                SELECT 
                    COUNT(*) AS total,
                    COUNT(CASE WHEN status = 'Approved' THEN 1 END) AS approved,
                    COUNT(CASE WHEN status = 'Rejected' THEN 1 END) AS rejected
                FROM clients
            `;
            const clientStatsResult = await pool.query(clientStatsQuery);
            stats.clients = clientStatsResult.rows[0];
        }

        res.status(200).json(stats);

    } catch (error){
        console.error("Error fetching stats:", error);
        res.status(500).json({ message: 'Server error while fetching stats.' });
    }
};

module.exports = { getStats };