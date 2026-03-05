require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function testRpc() {
    try {
        console.log('--- RAW RPC TEST ---');
        // Test commit_stock for ID 150
        const { data, error } = await supabase.rpc('commit_stock', {
            item_id: 150,
            amount: 1,
            case_id_val: null,
            reason_text: 'DEBUG-FINAL-TEST'
        });

        console.log('Error:', JSON.stringify(error, null, 2));
        console.log('Data:', JSON.stringify(data, null, 2));

        if (data) {
            console.log('\nChecking stock directly after RPC...');
            const { Pool } = require('pg');
            const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
            const res = await pool.query("SELECT stock_quantity FROM inventory WHERE id = 150");
            console.log('New Stock Qty:', res.rows[0].stock_quantity);
            await pool.end();
        }
    } catch (e) {
        console.error('Exception:', e.message);
    }
}

testRpc();
