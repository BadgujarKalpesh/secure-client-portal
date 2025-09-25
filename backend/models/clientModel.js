const { pool } = require('../config/db');

// Creates a new client in the database
const create = async (clientData, documents) => {
    const {
        organisationName,
        organisationAddress,
        organisationDomainId,
        natureOfBusiness,
        authorisedSignatoryFullName,
        authorisedSignatoryMobile,
        authorisedSignatoryEmail,
        authorisedSignatoryDesignation,
        billingContactName,
        billingContactNumber,
        billingContactEmail,
        organisationType
    } = clientData;

    // This INSERT statement now uses column names that directly correspond 
    // to the fields from your frontend form, converted to snake_case.
    const clientQuery = `
        INSERT INTO clients (
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
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *;
    `;

    const clientValues = [
        organisationName,
        organisationAddress,
        organisationDomainId,
        natureOfBusiness,
        authorisedSignatoryFullName,
        authorisedSignatoryMobile,
        authorisedSignatoryEmail,
        authorisedSignatoryDesignation,
        billingContactName,
        billingContactNumber,
        billingContactEmail,
        organisationType
    ];

    const clientResult = await pool.query(clientQuery, clientValues);
    const newClient = clientResult.rows[0];

    // If there are documents, add them to the documents table
    if (documents && documents.length > 0) {
        const documentQuery = 'INSERT INTO documents (client_id, url, public_id) VALUES ($1, $2, $3)';
        for (const doc of documents) {
            await pool.query(documentQuery, [newClient.id, doc.url, doc.public_id]);
        }
    }

    return newClient;
};

// Fetches all clients
const findAll = async () => {
    // This query now re-maps the database columns to the snake_case fields
    // that the frontend components (like the list and edit modal) expect.
    const query = `
        SELECT 
            id,
            authorised_signatory_full_name AS full_name,
            authorised_signatory_email AS email,
            authorised_signatory_mobile AS contact_number,
            organisation_address AS address,
            organisation_name AS business_name,
            status,
            created_at
        FROM clients 
        ORDER BY created_at DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
};

// Fetches a single client by their ID
const findById = async (id) => {
    const query = 'SELECT * FROM clients WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

// Updates a client's information
const update = async (id, updateData) => {
    const {
        fullName,
        contactNumber,
        email,
        address,
        businessName
    } = updateData;

    const query = `
        UPDATE clients 
        SET 
            authorised_signatory_full_name = $1, 
            authorised_signatory_mobile = $2, 
            authorised_signatory_email = $3, 
            organisation_address = $4, 
            organisation_name = $5
        WHERE id = $6
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [fullName, contactNumber, email, address, businessName, id]);
    return rows[0];
};

// Updates just the status of a client
const updateStatus = async (id, status) => {
    const query = 'UPDATE clients SET status = $1 WHERE id = $2 RETURNING *';
    const { rows } = await pool.query(query, [status, id]);
    return rows[0];
};

// Removes a client from the database
const remove = async (id) => {
    await pool.query('DELETE FROM documents WHERE client_id = $1', [id]);
    await pool.query('DELETE FROM clients WHERE id = $1', [id]);
};

module.exports = {
    create,
    findAll,
    findById,
    update,
    updateStatus,
    remove
};