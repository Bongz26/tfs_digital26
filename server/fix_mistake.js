const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function fixMistake() {
    const itemId = 39;

    console.log('--- Current Item 39 ---');
    const { data: itemBefore } = await supabase.from('inventory').select('*').eq('id', itemId).single();
    console.log(itemBefore);

    if (itemBefore.reserved_quantity > 0) {
        console.log(`\nReleasing 1 unit from item ${itemId}...`);
        const { data, error } = await supabase.rpc('release_stock', {
            item_id: itemId,
            amount: 1,
            reason_text: 'Mistaken reservation in Makeneng rectified per user request'
        });

        if (error) {
            console.error('Error releasing stock:', error);
        } else {
            console.log('Success:', data);
        }
    } else {
        console.log('\nNo reserved quantity to release.');
    }

    console.log('\n--- Item 39 After ---');
    const { data: itemAfter } = await supabase.from('inventory').select('*').eq('id', itemId).single();
    console.log(itemAfter);
}

fixMistake();
