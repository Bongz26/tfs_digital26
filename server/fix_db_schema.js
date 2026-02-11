const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixTableAndFunctions() {
    console.log('--- REPAIRING DATABASE SCHEMA ---');

    // 1. Rename table
    const sqlRename = `ALTER TABLE IF EXISTS inventory_movements RENAME TO stock_movements;`;

    // 2. Update functions (I'll just re-run the updated SQL files after this)

    console.log('Executing rename...');
    const { error: renameErr } = await supabase.rpc('exec_sql', { sql: sqlRename });

    if (renameErr) {
        console.error('Rename failed (maybe already renamed?):', renameErr);
    } else {
        console.log('✅ Table renamed to stock_movements');
    }
}

fixTableAndFunctions();
