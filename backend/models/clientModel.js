const { pool } = require('../config/db');

const create = async (clientData, documents) => {
    const {
        organisation_name,
        organisation_address,
        organisation_domain_id,
        nature_of_business,
        authorised_signatory_full_name,
        authorised_signatory_mobile,
        authorised_signatory_email,
        authorised_signatory_designation,
        billing_contact_name,
        billing_contact_number,
        billing_contact_email,
        organisation_type
    } = clientData;

    const clientQuery = `
        INSERT INTO clients (
            organisation_name, organisation_address, organisation_domain_id, nature_of_business,
            authorised_signatory_full_name, authorised_signatory_mobile, authorised_signatory_email, authorised_signatory_designation,
            billing_contact_name, billing_contact_number, billing_contact_email, organisation_type
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *;
    `;

    const clientValues = [
        organisation_name, organisation_address, organisation_domain_id, nature_of_business,
        authorised_signatory_full_name, authorised_signatory_mobile, authorised_signatory_email, authorised_signatory_designation,
        billing_contact_name, billing_contact_number, billing_contact_email, organisation_type
    ];

    const clientResult = await pool.query(clientQuery, clientValues);
    const newClient = clientResult.rows[0];

    if (documents && documents.length > 0) {
        const documentQuery = 'INSERT INTO documents (client_id, document_type, url, public_id) VALUES ($1, $2, $3, $4)';
        for (const doc of documents) {
            await pool.query(documentQuery, [newClient.id, doc.document_type, doc.url, doc.public_id]);
        }
    }

    return newClient;
};

const findAll = async () => {
    // Aliasing columns to match what the frontend expects for the client list
    const query = `
        SELECT 
            id,
            authorised_signatory_full_name AS full_name,
            authorised_signatory_email AS email,
            status
        FROM clients 
        ORDER BY created_at DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
};

const findById = async (id) => {
    const clientQuery = 'SELECT * FROM clients WHERE id = $1';
    const documentQuery = 'SELECT document_type, url FROM documents WHERE client_id = $1';
    
    const clientResult = await pool.query(clientQuery, [id]);
    const documentResult = await pool.query(documentQuery, [id]);

    if (clientResult.rows.length === 0) {
        return null;
    }

    const client = clientResult.rows[0];
    client.documents = documentResult.rows; // Attach documents to the client object

    return client;
};


const updateStatus = async (id, status) => {
    const query = 'UPDATE clients SET status = $1 WHERE id = $2 RETURNING *';
    const { rows } = await pool.query(query, [status, id]);
    return rows[0];
};

module.exports = {
    create,
    findAll,
    findById,
    updateStatus,
};