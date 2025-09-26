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

const findAll = async () => {
    const query = 'SELECT id, name, username, created_at FROM admins ORDER BY created_at DESC';
    const { rows } = await pool.query(query);
    return rows;
};

const update = async (id, { name, username, password }) => {
    let query;
    let queryParams;

    if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        query = 'UPDATE admins SET name = $1, username = $2, password = $3 WHERE id = $4 RETURNING id, name, username';
        queryParams = [name, username, hashedPassword, id];
    } else {
        query = 'UPDATE admins SET name = $1, username = $2 WHERE id = $3 RETURNING id, name, username';
        queryParams = [name, username, id];
    }
    const { rows } = await pool.query(query, queryParams);
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
    findAll,
    update,
    updateMfaTempSecret,
    enableMfa,
};