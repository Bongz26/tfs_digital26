const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
    const { data: tables, error } = await supabase.rpc('get_tables');
    if (error) {
        // Fallback: try different RPC or direct query if enabled
        console.error('get_tables RPC failed, trying query...');
        const { data: invMovements } = await supabase.from('inventory_movements').select('*').limit(1);
        const { data: stockMovements } = await supabase.from('stock_movements').select('*').limit(1);
        console.log('inventory_movements exists:', !!invMovements);
        console.log('stock_movements exists:', !!stockMovements);
        return;
    }
    console.log('Tables:', tables);
}

checkTables();
