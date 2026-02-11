const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listAllTables() {
    const { data: tables, error } = await supabase.from('inventory').select('*').limit(1); // Just to check connection
    if (error) { console.error('Connection error:', error); return; }

    // Try to get tables from pg_catalog if rpc fails
    const { data: pgTables, error: pgErr } = await supabase.rpc('get_tables');
    if (pgErr) {
        console.log('RPC get_tables failed. Trying direct SQL for table names...');
        // If we can't do direct SQL, we'll try to guess
        const potentialTables = ['stock_movements', 'inventory_movements', 'movements', 'stock_history'];
        for (const t of potentialTables) {
            const { data, error } = await supabase.from(t).select('*').limit(1);
            console.log(`Table ${t} exists:`, !error);
            if (data && data.length > 0) console.log(`   Columns in ${t}:`, Object.keys(data[0]));
        }
    } else {
        console.log('Tables from RPC:', pgTables);
    }
}

listAllTables();
