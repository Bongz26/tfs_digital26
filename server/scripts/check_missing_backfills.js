const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function findSpecificCases() {
    try {
        const { getSupabaseClient } = require('../utils/dbUtils');
        const supabase = getSupabaseClient();

        console.log('--- SUPABASE CLIENT (Last 5) ---');
        const { data: sbData } = await supabase.from('stock_movements').select('id, reason').order('id', { ascending: false }).limit(5);
        console.log(JSON.stringify(sbData, null, 2));

        console.log('\n--- PG POOL (Last 5) ---');
        const pgData = await pool.query('SELECT id, reason FROM stock_movements ORDER BY id DESC LIMIT 5');
        console.log(JSON.stringify(pgData.rows, null, 2));
    } catch (e) {
        console.error(e.message);
    } finally {
        await pool.end();
    }
}
findSpecificCases();
