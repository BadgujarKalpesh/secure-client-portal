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

    const clientQuery = `
        INSERT INTO clients (
            -- Added these three columns to satisfy the NOT NULL constraint
            full_name,
            email,
            contact_number,

            -- The rest of the organisation and contact details
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
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *;
    `;

    const clientValues = [
        // Mapped authorised signatory details to the required columns
        authorisedSignatoryFullName,
        authorisedSignatoryEmail,
        authorisedSignatoryMobile,

        // The rest of the values
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

    // Document insertion logic remains the same
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
    const query = `
        SELECT 
            id,
            full_name,
            email,
            contact_number,
            address,
            business_name,
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
        businessName,
        // Add other fields you might want to update
    } = updateData;

    const query = `
        UPDATE clients 
        SET 
            full_name = $1, 
            contact_number = $2, 
            email = $3, 
            address = $4, 
            business_name = $5
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