const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function rectifyCase161() {
    const CASE_ID = 161; // THS-2026-057
    const OLD_ITEM_ID = 63; // Makeneng 1.9 FEET
    const BRANCH = 'Head Office';
    const CASKET_NAME = '1.9 FEET';
    const CASKET_COLOR = 'KIAAT';

    console.log(`🔧 Rectifying Case ${CASE_ID} (${BRANCH})...`);

    // 1. Find Correct Head Office Item
    let { data: hoItem, error: findErr } = await supabase
        .from('inventory')
        .select('*')
        .eq('location', BRANCH)
        .eq('name', CASKET_NAME)
        .ilike('color', CASKET_COLOR)
        .maybeSingle();

    if (!hoItem) {
        console.log(`⚠️ Item '${CASKET_NAME} (${CASKET_COLOR})' not found in ${BRANCH}. Creating Ghost Stock...`);
        // Create Ghost Item
        const { data: newItem, error: createErr } = await supabase
            .from('inventory')
            .insert({
                name: CASKET_NAME,
                model: 'COFFIN',
                color: CASKET_COLOR,
                category: 'coffin',
                location: BRANCH,
                stock_quantity: 0, // Will become -1 after reservation
                reserved_quantity: 0,
                min_threshold: 5,
                notes: 'Auto-created Ghost Stock for Case 161 Rectification'
            })
            .select()
            .single();

        if (createErr) {
            console.error('❌ Failed to create ghost item:', createErr.message);
            return;
        }
        hoItem = newItem;
        console.log(`✅ Created Ghost Item ID: ${hoItem.id}`);
    } else {
        console.log(`✅ Found Existing HO Item ID: ${hoItem.id}`);
    }

    // 2. Release Makeneng Stock (ID 63)
    // We do this manually via RPC or direct update if permitted, but let's use the release_stock function if possible or just manual SQL to be safe with existing logic
    // Actually, calling release_stock might require the case to be in a specific state or might just work.
    // Let's use `release_stock` RPC.

    // Check if there is a reservation first? Yes we saw it.

    // We will use a raw SQL call to manually adjust to ensure clarity and avoid side effects of the controller logic

    // A. Decrement Reserved on Makeneng (ID 63)
    const { error: releaseErr } = await supabase.rpc('release_stock', {
        p_item_id: OLD_ITEM_ID,
        p_quantity: 1,
        p_user_email: 'system_fix',
        p_reason: 'Rectifying Incorrect Branch Reservation (Case 161)'
    });

    if (releaseErr) console.error('❌ Failed to release Makeneng stock:', releaseErr);
    else console.log('✅ Released Makeneng Stock (ID 63)');

    // B. Increment Reserved on HO Item
    const { error: reserveErr } = await supabase.rpc('reserve_stock', {
        p_item_id: hoItem.id,
        p_quantity: 1,
        p_user_email: 'system_fix',
        p_reason: 'Rectified Reservation for Case 161'
    });

    if (reserveErr) console.error('❌ Failed to reserve HO stock:', reserveErr);
    else console.log(`✅ Reserved HO Stock (ID ${hoItem.id})`);

    // 3. Update Audit / Notes if needed (Optional)
    console.log('🎉 Rectification Complete.');
}

rectifyCase161();
