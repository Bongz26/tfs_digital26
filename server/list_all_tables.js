const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function listTables() {
    try {
        console.log('--- Listing All Public Tables ---');
        const res = await pool.query(`
            SELECT tablename 
            FROM pg_catalog.pg_tables 
            WHERE schemaname = 'public'
            ORDER BY tablename;
        `);
        console.log('Tables:', JSON.stringify(res.rows.map(r => r.tablename), null, 2));
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

listTables();
