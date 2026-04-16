const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY);

async function check() {
    const { data: movements } = await supabase
        .from('stock_movements')
        .select('*')
        .eq('inventory_id', 64)
        .order('created_at', { ascending: true });
        
    fs.writeFileSync('reserved_data3.json', JSON.stringify({ movements }, null, 2));
    console.log("Done");
}
check();
