const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkRLS() {
    try {
        console.log('--- Checking RLS for inventory table ---');
        const res = await pool.query(`
            SELECT tablename, rowsecurity 
            FROM pg_tables 
            WHERE schemaname = 'public' AND tablename = 'inventory';
        `);
        console.log('RLS Status:', JSON.stringify(res.rows, null, 2));

        const policies = await pool.query(`
            SELECT * FROM pg_policies WHERE tablename = 'inventory';
        `);
        console.log('Policies:', JSON.stringify(policies.rows, null, 2));
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkRLS();
