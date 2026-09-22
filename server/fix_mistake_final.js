const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function fixMistake() {
    const itemId = 14;

    console.log('--- Fixing Item 14 Mistake ---');

    // 1. Mark reservations as released
    const { data: reservations, error: resErr } = await supabase
        .from('reservations')
        .update({ released_at: new Date(), status: 'released' })
        .eq('inventory_id', itemId)
        .is('released_at', null);

    if (resErr) {
        console.error('Failed to update reservations table:', resErr);
    } else {
        console.log('Marked related reservations as released.');
    }

    // 2. Clear reserved_quantity in inventory (Atomic)
    // We can use RPC or direct update to 0 if we know it should be 0.
    // The user said "rectified the makeneng reserved coffin", implying it should NOT be reserved at all.
    const { error: invErr } = await supabase
        .from('inventory')
        .update({ reserved_quantity: 0, updated_at: new Date() })
        .eq('id', itemId);

    if (invErr) {
        console.error('Failed to clear reserved_quantity:', invErr);
    } else {
        console.log('Successfully cleared reserved_quantity for item 14 in Makeneng.');
    }
}

fixMistake();
