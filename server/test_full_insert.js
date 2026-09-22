const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function testFullInsert() {
    console.log('--- Full Insert Test ---');
    const newItemObj = {
        name: 'FULL TEST ' + Date.now(),
        model: 'TEST MODEL',
        color: 'TEST COLOR',
        category: 'coffin',
        location: 'MAKENENG',
        stock_quantity: 0,
        reserved_quantity: 0,
        low_stock_threshold: 5,
        price_retail: 0,
        price_wholesale: 0,
        sku: 'TEST-SKU-' + Date.now(),
        description: 'Test Description',
        supplier: 'System',
        status: 'Active',
        notes: 'Test Notes'
    };

    const { data, error } = await supabase
        .from('inventory')
        .insert(newItemObj)
        .select();

    if (error) {
        console.error('ERROR:', JSON.stringify(error, null, 2));
    } else {
        console.log('SUCCESS:', JSON.stringify(data, null, 2));
    }
}

testFullInsert();
