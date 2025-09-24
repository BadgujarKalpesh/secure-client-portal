const { pool } = require('../config/db');

const create = async (clientData, documents) => {
    const clientResult = await pool.query(
        'INSERT INTO clients (full_name, contact_number, email, address, business_name, gst_number, pan_number, fssai_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [clientData.fullName, clientData.contactNumber, clientData.email, clientData.address, clientData.businessName, clientData.gstNumber, clientData.panNumber, clientData.fssaiCode]
    );
    const newClient = clientResult.rows[0];

    if (documents && documents.length > 0) {
        for (const doc of documents) {
            await pool.query(
                'INSERT INTO documents (client_id, url, public_id) VALUES ($1, $2, $3)',
                [newClient.id, doc.url, doc.public_id]
            );
        }
    }
    // Fetch the client again to include documents
    return findById(newClient.id);
};

const findAll = async () => {
    const query = 'SELECT * FROM clients ORDER BY created_at DESC';
    const { rows } = await pool.query(query);
    return rows;
};

const findById = async (id) => {
    const clientQuery = 'SELECT * FROM clients WHERE id = $1';
    const docQuery = 'SELECT * FROM documents WHERE client_id = $1';

    const clientRes = await pool.query(clientQuery, [id]);
    const docRes = await pool.query(docQuery, [id]);

    if (clientRes.rows.length === 0) {
        return null;
    }

    const client = clientRes.rows[0];
    client.documents = docRes.rows;
    return client;
};

const update = async (id, updateData) => {
    const { fullName, contactNumber, email, address, businessName, gstNumber, panNumber, fssaiCode } = updateData;
    const query = `
        UPDATE clients 
        SET full_name = $1, contact_number = $2, email = $3, address = $4, business_name = $5, gst_number = $6, pan_number = $7, fssai_code = $8, updated_at = CURRENT_TIMESTAMP
        WHERE id = $9 RETURNING *`;
    const { rows } = await pool.query(query, [fullName, contactNumber, email, address, businessName, gstNumber, panNumber, fssaiCode, id]);
    return rows[0];
};

const updateStatus = async (id, status) => {
    const query = 'UPDATE clients SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
    const { rows } = await pool.query(query, [status, id]);
    return rows[0];
};

const remove = async (id) => {
    const query = 'DELETE FROM clients WHERE id = $1';
    await pool.query(query, [id]);
};

module.exports = {
    create,
    findAll,
    findById,
    update,
    updateStatus,
    remove,
};