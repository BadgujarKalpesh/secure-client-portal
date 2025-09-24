// backend/scripts/createAdmin.js

// 1. Load environment variables first with the correct path
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

// 2. Add a check to ensure the DATABASE_URL is loaded
if (!process.env.DATABASE_URL) {
    console.error("Error: DATABASE_URL is not defined. Make sure your backend/.env file is correct.");
    process.exit(1);
}

const { pool } = require('../config/db'); // 3. Now import the pool
const bcrypt = require('bcryptjs');

const createAdminUser = async () => {
    const client = await pool.connect();
    try {
        const username = 'admin';
        const password = '12345'; // Use a strong, temporary password

        // Check if the admin user already exists
        const existingAdminRes = await client.query('SELECT * FROM admins WHERE username = $1', [username]);

        if (existingAdminRes.rows.length > 0) {
            console.log('Admin user already exists.');
            return;
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert the new admin user
        await client.query(
            'INSERT INTO admins (username, password) VALUES ($1, $2)',
            [username, hashedPassword]
        );
        
        console.log('✅ Admin user created successfully!');

    } catch (error) {
        console.error('Error creating admin user:', error.message);
    } finally {
        client.release();
        await pool.end();
    }
};

createAdminUser();