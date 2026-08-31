const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const { findOrCreateInventoryItem } = require('../utils/inventoryHelpers');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function recover() {
    try {
        console.log('--- Recovering Misfired Stock Transfers ---');

        const fixes = [
            {
                transfer: 'TRF-2026-030',
                wrongId: 137,
                intent: { name: 'PRINCE DOME', model: 'CASKET', color: 'WALLNUT', branch: 'Makeneng' }
            },
            {
                transfer: 'TRF-2026-032',
                wrongId: 1,
                intent: { name: 'ECONO', model: 'CASKET', color: 'CHERRY', branch: 'Makeneng' }
            },
            {
                transfer: 'TRF-2026-033',
                wrongId: 314,
                intent: { name: '1/4 VIEW', model: 'CASKET', color: 'KIAAT', branch: 'Head Office' }
            }
        ];

        for (const fix of fixes) {
            console.log(`\nFixing ${fix.transfer}...`);

            // 1. Decrement wrong item
            const { data: wrongItem, error: fetchErr } = await supabase.from('inventory').select('name, stock_quantity, location').eq('id', fix.wrongId).single();
            if (fetchErr || !wrongItem) {
                console.error(`  ❌ Error fetching wrong item ${fix.wrongId}:`, fetchErr?.message);
                continue;
            }

            console.log(`  - Reversing stock from: ${wrongItem.name} (${wrongItem.location}) [ID: ${fix.wrongId}]`);
            const { error: decErr } = await supabase.rpc('increment_inventory', { 
                item_id: fix.wrongId, 
                qty: -1 
            });
            
            // Fallback if RPC doesn't exist (it usually does in this codebase)
            if (decErr) {
                 const { error: updErr } = await supabase.from('inventory').update({ stock_quantity: wrongItem.stock_quantity - 1 }).eq('id', fix.wrongId);
                 if (updErr) console.error('  ❌ Manual decrement failed:', updErr.message);
            }

            // 2. Add to correct item
            console.log(`  - Adding stock to intent: ${fix.intent.name} ${fix.intent.model} ${fix.intent.color} (${fix.intent.branch})`);
            const correctItem = await findOrCreateInventoryItem(supabase, {
                ...fix.intent,
                category: 'coffin',
                caseNumber: `CORRECTION-${fix.transfer}`
            });

            const { error: incErr } = await supabase.rpc('increment_inventory', { 
                item_id: correctItem.id, 
                qty: 1 
            });
            if (incErr) {
                await supabase.from('inventory').update({ stock_quantity: (correctItem.stock_quantity || 0) + 1 }).eq('id', correctItem.id);
            }

            // 3. Log movement
            await supabase.from('stock_movements').insert([
                {
                    inventory_id: fix.wrongId,
                    movement_type: 'adjustment',
                    quantity_change: -1,
                    reason: `CORRECTION: Reversing misfire from ${fix.transfer}`,
                    recorded_by: 'system_recovery'
                },
                {
                    inventory_id: correctItem.id,
                    movement_type: 'adjustment',
                    quantity_change: 1,
                    reason: `CORRECTION: Restoring stock from ${fix.transfer}`,
                    recorded_by: 'system_recovery'
                }
            ]);

            console.log(`  ✅ ${fix.transfer} recovery complete.`);
        }

        console.log('\n--- All Recovery Operations Complete ---');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

recover();
