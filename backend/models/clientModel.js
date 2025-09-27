const { pool } = require('../config/db');

const create = async (clientData, documents) => {
    // Start a transaction
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Generate the next customer_id
        const lastIdRes = await client.query("SELECT customer_id FROM clients ORDER BY id DESC LIMIT 1");
        let nextId = 1;
        if (lastIdRes.rows.length > 0 && lastIdRes.rows[0].customer_id) {
            nextId = parseInt(lastIdRes.rows[0].customer_id, 10) + 1;
        }
        const customerId = String(nextId).padStart(6, '0');

        // 2. Insert the new client with the generated customer_id and account_manager_id
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
            organisationType,
            accountManagerId // <-- New field
        } = clientData;

        const clientQuery = `
            INSERT INTO clients (
                customer_id, full_name, email, contact_number, business_name, address,
                organisation_name, organisation_address, organisation_domain_id,
                nature_of_business, authorised_signatory_full_name,
                authorised_signatory_mobile, authorised_signatory_email,
                authorised_signatory_designation, billing_contact_name,
                billing_contact_number, billing_contact_email, organisation_type,
                account_manager_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
            RETURNING *;
        `;
        const clientValues = [
            customerId, authorisedSignatoryFullName, authorisedSignatoryEmail,
            authorisedSignatoryMobile, organisationName, organisationAddress,
            organisationName, organisationAddress, organisationDomainId,
            natureOfBusiness, authorisedSignatoryFullName,
            authorisedSignatoryMobile, authorisedSignatoryEmail,
            authorisedSignatoryDesignation, billingContactName,
            billingContactNumber, billingContactEmail, organisationType,
            accountManagerId // <-- New value
        ];
        
        const clientResult = await client.query(clientQuery, clientValues);
        const newClient = clientResult.rows[0];

        if (documents && documents.length > 0) {
            const documentQuery = 'INSERT INTO documents (client_id, url, public_id, document_type, document_unique_id) VALUES ($1, $2, $3, $4, $5)';
            for (const doc of documents) {
                await client.query(documentQuery, [newClient.id, doc.url, doc.public_id, doc.document_type, doc.document_unique_id]);
            }
        }

        await client.query('COMMIT');
        return newClient;

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const findAll = async () => {
    const query = `
        SELECT 
            id,
            customer_id, -- <-- Added this line
            full_name,
            email,
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


const updateStatus = async (id, status) => {
    const query = 'UPDATE clients SET status = $1 WHERE id = $2 RETURNING *';
    const { rows } = await pool.query(query, [status, id]);
    return rows[0];
};


const update = async (id, clientData) => {
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

    const query = `
        UPDATE clients 
        SET 
            organisation_name = $1,
            organisation_address = $2,
            organisation_domain_id = $3,
            nature_of_business = $4,
            authorised_signatory_full_name = $5,
            authorised_signatory_mobile = $6,
            authorised_signatory_email = $7,
            authorised_signatory_designation = $8,
            billing_contact_name = $9,
            billing_contact_number = $10,
            billing_contact_email = $11,
            organisation_type = $12,
            full_name = $5, 
            email = $7, 
            contact_number = $6, 
            business_name = $1, 
            address = $2
        WHERE id = $13
        RETURNING *;
    `;
    const values = [
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
        organisation_type,
        id
    ];
    
    const { rows } = await pool.query(query, values);
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