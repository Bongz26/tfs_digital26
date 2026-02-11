const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { reserveStock } = require('./utils/dbUtils');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function debugRpc() {
    console.log('--- RPC Debug ---');

    // 1. Create a fresh item
    const itemName = 'RPC DEBUG ' + Date.now();
    const { data: items } = await supabase.from('inventory').insert({
        name: itemName,
        location: 'MAKENENG',
        category: 'coffin',
        stock_quantity: 0,
        reserved_quantity: 0
    }).select();

    const item = items[0];
    console.log(`Created Item ID: ${item.id}, Reserved: ${item.reserved_quantity}`);

    // 2. Call RPC
    console.log('Calling reserve_stock with amount 1...');
    const res = await reserveStock(item.id, 1, 'debug', 'RPC Test');
    console.log('RPC Result:', JSON.stringify(res, null, 2));

    // 3. Check DB again
    const { data: verify } = await supabase.from('inventory').select('reserved_quantity').eq('id', item.id).single();
    console.log(`Post-RPC DB Reserved: ${verify.reserved_quantity}`);

    // 4. Cleanup
    await supabase.from('inventory').delete().eq('id', item.id);
}

debugRpc();
