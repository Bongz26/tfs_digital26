const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function checkMakenengReserves() {
    console.log('--- Makeneng Items with Reservations ---');
    const { data: items } = await supabase
        .from('inventory')
        .select('id, name, model, color, location, reserved_quantity, stock_quantity')
        .ilike('location', '%Makeneng%')
        .gt('reserved_quantity', 0);

    console.log(JSON.stringify(items, null, 2));

    if (items && items.length > 0) {
        for (const item of items) {
            console.log(`\n--- Active Reservations for item ID ${item.id} ---`);
            const { data: res } = await supabase
                .from('reservations')
                .select('*, cases(case_number, deceased_name)')
                .eq('inventory_id', item.id)
                .is('released_at', null); // ONLY active ones
            console.log(JSON.stringify(res, null, 2));
        }
    } else {
        console.log('No Makeneng items currently have reserved stock.');
    }
}

checkMakenengReserves();
