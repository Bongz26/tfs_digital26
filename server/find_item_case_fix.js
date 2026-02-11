const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function findItemAndCase() {
    console.log('--- Searching for 1.9 Feet Kiaat in Makeneng ---');
    const { data: items } = await supabase
        .from('inventory')
        .select('*')
        .ilike('name', '%Kiaat%')
        .eq('location', 'MAKENENG');

    console.log('Items found:', JSON.stringify(items, null, 2));

    if (items && items.length > 0) {
        for (const item of items) {
            console.log(`\n--- Reservations for item ID ${item.id} (${item.name}) ---`);
            const { data: res } = await supabase
                .from('reservations')
                .select('*, cases(case_number, deceased_name)')
                .eq('inventory_id', item.id);
            console.log(JSON.stringify(res, null, 2));
        }
    }
}

findItemAndCase();
