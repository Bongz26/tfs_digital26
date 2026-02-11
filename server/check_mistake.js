const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function checkReserves() {
    console.log('--- Inventory Details for ID 39 ---');
    const { data: item39 } = await supabase.from('inventory').select('*').eq('id', 39);
    console.log(JSON.stringify(item39, null, 2));

    console.log('\n--- Case Details for THS-2026-082 ---');
    const { data: case082 } = await supabase.from('cases').select('*').eq('case_number', 'THS-2026-082');
    console.log(JSON.stringify(case082, null, 2));

    console.log('\n--- All Items with reserved_quantity > 0 ---');
    const { data: allReserved } = await supabase.from('inventory').select('id, name, location, stock_quantity, reserved_quantity').gt('reserved_quantity', 0);
    console.log(JSON.stringify(allReserved, null, 2));
}

checkReserves();
