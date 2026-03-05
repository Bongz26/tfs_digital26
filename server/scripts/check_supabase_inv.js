require('dotenv').config();
const { getSupabaseClient } = require('../utils/dbUtils');

async function checkSupabaseInventory() {
    const supabase = getSupabaseClient();
    console.log('--- SUPABASE INVENTORY CHECK ---');

    const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .ilike('name', '%1/4 View%')
        .ilike('location', 'Head Office');

    if (error) {
        console.error('Error:', error.message);
        return;
    }

    console.log(`Found ${data.length} items for "1/4 View" at "Head Office":`);
    data.forEach(item => {
        console.log(`ID: ${item.id} | SKU: ${item.sku} | Qty: ${item.stock_quantity}/${item.reserved_quantity} | Notes: ${item.notes}`);
    });
}

checkSupabaseInventory();
