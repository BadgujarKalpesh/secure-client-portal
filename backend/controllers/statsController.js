const { pool } = require('../config/db');

const getStats = async (req, res) => {
    try {
        // All users can see client stats
        const clientStatsQuery = `
            SELECT 
                COUNT(*) AS total,
                COUNT(CASE WHEN status = 'Approved' THEN 1 END) AS approved,
                COUNT(CASE WHEN status = 'Rejected' THEN 1 END) AS rejected
            FROM clients
        `;
        const clientStatsResult = await pool.query(clientStatsQuery);

        let stats = {
            clients: clientStatsResult.rows[0],
            viewers: { total: 0 } // Default to 0
        };

        // Only fetch and add viewer stats if the user is an admin
        if (req.user.role === 'admin') {
            const viewerStatsQuery = 'SELECT COUNT(*) AS total FROM viewers';
            const viewerStatsResult = await pool.query(viewerStatsQuery);
            stats.viewers = viewerStatsResult.rows[0];
        }

        res.status(200).json(stats);

    } catch (error){
        console.error("Error fetching stats:", error);
        res.status(500).json({ message: 'Server error while fetching stats.' });
    }
};

module.exports = { getStats };