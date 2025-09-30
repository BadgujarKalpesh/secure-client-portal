const { pool } = require('../config/db');

const create = async (userId, username, userRole, action, details) => {
    const query = `
        INSERT INTO audit_logs (user_id, username, user_role, action, details)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [userId, username, userRole, action, details]);
    return rows[0];
};

const findAll = async () => {
    const query = 'SELECT * FROM audit_logs ORDER BY created_at DESC';
    const { rows } = await pool.query(query);
    return rows;
};

module.exports = {
    create,
    findAll,
};