const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

const create = async (name, username, password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const query = 'INSERT INTO admins (name, username, password) VALUES ($1, $2, $3) RETURNING id, name, username, created_at';
    const { rows } = await pool.query(query, [name, username, hashedPassword]);
    return rows[0];
};

const findById = async (id) => {
    const query = 'SELECT id, username, mfa_secret, is_mfa_enabled, mfa_temp_secret FROM admins WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

const findByUsername = async (username) => {
    const query = 'SELECT * FROM admins WHERE username = $1';
    const { rows } = await pool.query(query, [username]);
    return rows[0];
};

const updateMfaTempSecret = async (id, secret) => {
    const query = 'UPDATE admins SET mfa_temp_secret = $1 WHERE id = $2';
    await pool.query(query, [secret, id]);
};

const enableMfa = async (id, secret) => {
    const query = 'UPDATE admins SET mfa_secret = $1, is_mfa_enabled = true, mfa_temp_secret = NULL WHERE id = $2';
    await pool.query(query, [secret, id]);
};


module.exports = {
    create,
    findById,
    findByUsername,
    updateMfaTempSecret,
    enableMfa,
};