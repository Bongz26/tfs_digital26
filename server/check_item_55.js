const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function checkItem55() {
    console.log('--- Details for Item 55 (1.9 Feet Kiaat Makeneng) ---');
    const { data: item } = await supabase.from('inventory').select('*').eq('id', 55).single();
    console.log(JSON.stringify(item, null, 2));

    console.log('\n--- Reservations for Item 55 ---');
    const { data: res } = await supabase.from('reservations').select('*, cases(*)').eq('inventory_id', 55);
    console.log(JSON.stringify(res, null, 2));

    console.log('\n--- Stock Movements for Item 55 ---');
    const { data: move } = await supabase.from('stock_movements').select('*').eq('inventory_id', 55).order('created_at', { ascending: false });
    console.log(JSON.stringify(move, null, 2));
}

checkItem55();
