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
            -- Columns for easy access & to satisfy NOT NULL constraints
            full_name,
            email,
            contact_number,
            business_name,
            address,

            -- The rest of the detailed organisation and contact fields
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
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING *;
    `;

    const clientValues = [
        // Mapped main details to the required columns
        authorisedSignatoryFullName,
        authorisedSignatoryEmail,
        authorisedSignatoryMobile,
        organisationName,
        organisationAddress,

        // The rest of the detailed values
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
        const documentQuery = 'INSERT INTO documents (client_id, url, public_id, document_type) VALUES ($1, $2, $3, $4)';
        for (const doc of documents) {
            // Note: You might want to add a 'document_type' column to your documents table
            // to distinguish between PAN, GST, etc. For now, this will work.
            await pool.query(documentQuery, [newClient.id, doc.url, doc.public_id, doc.document_type]);
        }
    }

    return newClient;
};


// Fetches all clients
const findAll = async () => {
    // This query now directly selects the main fields your frontend list expects.
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

// ... (keep the rest of the functions like updateStatus, etc., the same)

const updateStatus = async (id, status) => {
    const query = 'UPDATE clients SET status = $1 WHERE id = $2 RETURNING *';
    const { rows } = await pool.query(query, [status, id]);
    return rows[0];
};

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