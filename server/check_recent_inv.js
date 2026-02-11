const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function checkRecentInventory() {
    console.log('--- Checking Inventory Updated in last 48 hours ---');

    const { data: items, error } = await supabase
        .from('inventory')
        .select('*')
        .gt('updated_at', new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString())
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('Error fetching inventory:', error.message);
        return;
    }

    console.log(`Found ${items.length} recently updated items:`);
    items.forEach(i => {
        console.log(`[${i.updated_at}] ID: ${i.id} | Name: ${i.name} | Branch: ${i.location} | Stock: ${i.stock_quantity} | Reserved: ${i.reserved_quantity}`);
    });
}

checkRecentInventory();
