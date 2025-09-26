const { pool } = require('../config/db');

const findById = async (id) => {
    const query = 'SELECT id, username, mfa_secret, is_mfa_enabled, mfa_temp_secret FROM super_admins WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

const findByUsername = async (username) => {
    const query = 'SELECT * FROM super_admins WHERE username = $1';
    const { rows } = await pool.query(query, [username]);
    return rows[0];
};

const updateMfaTempSecret = async (id, secret) => {
    const query = 'UPDATE super_admins SET mfa_temp_secret = $1 WHERE id = $2';
    await pool.query(query, [secret, id]);
};

const enableMfa = async (id, secret) => {
    const query = 'UPDATE super_admins SET mfa_secret = $1, is_mfa_enabled = true, mfa_temp_secret = NULL WHERE id = $2';
    await pool.query(query, [secret, id]);
};


module.exports = {
    findById,
    findByUsername,
    updateMfaTempSecret,
    enableMfa,
};