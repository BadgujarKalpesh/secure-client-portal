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

module.exports = {
    create,
    findByUsername,
    findAll,
};