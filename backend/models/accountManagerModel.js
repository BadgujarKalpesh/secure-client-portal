const { pool } = require('../config/db');

const create = async (name, email, contactNumber) => {
    const query = 'INSERT INTO account_managers (name, email, contact_number) VALUES ($1, $2, $3) RETURNING *';
    const { rows } = await pool.query(query, [name, email, contactNumber]);
    return rows[0];
};

const findAll = async () => {
    const query = 'SELECT * FROM account_managers ORDER BY created_at DESC';
    const { rows } = await pool.query(query);
    return rows;
};

const findById = async (id) => {
    const query = 'SELECT * FROM account_managers WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

const update = async (id, { name, email, contact_number }) => {
    const query = 'UPDATE account_managers SET name = $1, email = $2, contact_number = $3 WHERE id = $4 RETURNING *';
    const { rows } = await pool.query(query, [name, email, contact_number, id]);
    return rows[0];
};

module.exports = {
    create,
    findAll,
    findById,
    update,
};