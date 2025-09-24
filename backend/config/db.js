const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log(`PostgreSQL Connected: ${client.database}`);
        client.release(); // Release the client back to the pool
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = { pool, connectDB };