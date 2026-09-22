const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectSchema() {
    const { data, error } = await supabase
        .from('inventory_movements')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error:', error);
        return;
    }

    if (data && data.length > 0) {
        console.log('Columns:', Object.keys(data[0]));
    } else {
        console.log('Table exists but is empty. Trying to get columns from information_schema...');
        const { data: cols, error: colErr } = await supabase.rpc('get_table_columns', { table_name_val: 'inventory_movements' });
        if (colErr) console.error('Column RPC error:', colErr);
        else console.log('Columns from RPC:', cols);
    }
}

inspectSchema();
