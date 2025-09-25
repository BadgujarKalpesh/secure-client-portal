const { pool } = require('../config/db');

const getStats = async (req, res) => {
    try {
        const clientStatsQuery = `
            SELECT 
                COUNT(*) AS total,
                COUNT(CASE WHEN status = 'Approved' THEN 1 END) AS approved,
                COUNT(CASE WHEN status = 'Rejected' THEN 1 END) AS rejected
            FROM clients
        `;
        
        const viewerStatsQuery = 'SELECT COUNT(*) AS total FROM viewers';

        const clientStatsResult = await pool.query(clientStatsQuery);
        const viewerStatsResult = await pool.query(viewerStatsQuery);

        res.status(200).json({
            clients: clientStatsResult.rows[0],
            viewers: viewerStatsResult.rows[0],
        });

    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ message: 'Server error while fetching stats.' });
    }
};

module.exports = { getStats };