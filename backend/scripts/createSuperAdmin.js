// backend/scripts/createSuperAdmin.js

// 1. Load environment variables first with the correct path
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

// 2. Add a check to ensure the DATABASE_URL is loaded
if (!process.env.DATABASE_URL) {
    console.error("Error: DATABASE_URL is not defined. Make sure your backend/.env file is correct.");
    process.exit(1);
}

const { pool } = require('../config/db'); // 3. Now import the pool
const bcrypt = require('bcryptjs');

const createSuperAdminUser = async () => {
    const client = await pool.connect();
    try {
        const username = 'superadmin';
        const password = '12345'; // Use a strong, temporary password

        // Check if the super admin user already exists
        const existingSuperAdminRes = await client.query('SELECT * FROM super_admins WHERE username = $1', [username]);

        if (existingSuperAdminRes.rows.length > 0) {
            console.log('Super Admin user already exists.');
            return;
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert the new super admin user
        await client.query(
            'INSERT INTO super_admins (username, password) VALUES ($1, $2)',
            [username, hashedPassword]
        );
        
        console.log('✅ Super Admin user created successfully!');

    } catch (error) {
        console.error('Error creating super admin user:', error.message);
    } finally {
        client.release();
        await pool.end();
    }
};

createSuperAdminUser();