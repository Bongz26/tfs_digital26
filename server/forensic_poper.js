const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function analyzePoper() {
    console.log('--- Forensic Analysis: Pongee Poper ---');

    // 1. Find all items matching "Pongee"
    const { data: items, error: itemErr } = await supabase
        .from('inventory')
        .select('*')
        .ilike('name', '%Pongee%');

    if (itemErr) {
        console.error('Error fetching inventory:', itemErr.message);
        return;
    }

    console.log(`Found ${items.length} inventory entries matching "Pongee":`);
    items.forEach(i => {
        console.log(`ID: ${i.id} | Name: ${i.name} | Branch: ${i.location} | Stock: ${i.stock_quantity} | Reserved: ${i.reserved_quantity} | Avail: ${(i.stock_quantity || 0) - (i.reserved_quantity || 0)}`);
    });

    const itemIds = items.map(i => i.id);

    if (itemIds.length === 0) {
        console.log('No Pongee items found.');
        return;
    }

    // 2. Check Stock Movements
    const { data: movements, error: movErr } = await supabase
        .from('stock_movements')
        .select('*')
        .in('inventory_id', itemIds)
        .order('created_at', { ascending: true });

    if (movErr) {
        console.error('Error fetching movements:', movErr.message);
    } else {
        console.log(`\n--- Stock Movement History for Pongee items (${movements.length} records) ---`);
        movements.forEach(m => {
            console.log(`[${m.created_at}] Item: ${m.inventory_id} | Type: ${m.movement_type} | Change: ${m.quantity_change} | New Stock: ${m.new_quantity} | Case: ${m.case_id} | Reason: ${m.reason}`);
        });
    }

    // 3. Check active Reservations
    const { data: reservations, error: resErr } = await supabase
        .from('reservations')
        .select('*')
        .in('inventory_id', itemIds)
        .eq('status', 'active');

    if (resErr) {
        console.error('Error fetching reservations:', resErr.message);
    } else {
        console.log(`\n--- Active Reservations for Pongee items (${reservations.length} records) ---`);
        reservations.forEach(r => {
            console.log(`[${r.created_at}] Item: ${r.inventory_id} | Case: ${r.case_number || r.case_id} | Amount: ${r.quantity}`);
        });
    }
}

analyzePoper();
