const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

const create = async (username, password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const query = 'INSERT INTO viewers (username, password) VALUES ($1, $2) RETURNING id, username, created_at';
    const { rows } = await pool.query(query, [username, hashedPassword]);
    return rows[0];
};

const findByUsername = async (username) => {
    const query = 'SELECT * FROM viewers WHERE username = $1';
    const { rows } = await pool.query(query, [username]);
    return rows[0];
};

const findAll = async () => {
    const query = 'SELECT id, username, created_at FROM viewers ORDER BY created_at DESC';
    const { rows } = await pool.query(query);
    return rows;
};

// ** ADD THIS FUNCTION (for authMiddleware) **
const findById = async (id) => {
    const query = 'SELECT id, username, mfa_secret, is_mfa_enabled, mfa_temp_secret FROM viewers WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

// ** ADD THIS FUNCTION (for MFA setup) **
const updateMfaTempSecret = async (id, secret) => {
    const query = 'UPDATE viewers SET mfa_temp_secret = $1 WHERE id = $2';
    await pool.query(query, [secret, id]);
};

// ** ADD THIS FUNCTION (for MFA verification) **
const enableMfa = async (id, secret) => {
    const query = 'UPDATE viewers SET mfa_secret = $1, is_mfa_enabled = true, mfa_temp_secret = NULL WHERE id = $2';
    await pool.query(query, [secret, id]);
};


module.exports = {
    create,
    findByUsername,
    findAll,
    findById,
    updateMfaTempSecret,
    enableMfa,
};