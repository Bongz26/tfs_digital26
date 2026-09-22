const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function applySql() {
    const sqlPath = path.join(__dirname, 'database', 'functions', 'create_reservation_functions.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    try {
        const client = await pool.connect();
        console.log('✅ Connected to database.');
        await client.query(sql);
        console.log('✅ Successfully applied SQL migration.');
        client.release();
    } catch (err) {
        console.error('❌ Failed to apply SQL:', err.message);
    } finally {
        await pool.end();
    }
}

applySql();
