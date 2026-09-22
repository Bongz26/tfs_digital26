const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkTriggers() {
    try {
        console.log('--- Checking Triggers on inventory table ---');
        const res = await pool.query(`
            SELECT trigger_name, event_manipulation, condition_timing, action_statement
            FROM information_schema.triggers
            WHERE event_object_table = 'inventory';
        `);
        console.log('Triggers:', JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkTriggers();
