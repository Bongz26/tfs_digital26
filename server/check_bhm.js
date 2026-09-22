const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY);

async function diagnostic() {
    console.log('--- Case Diagnostic (BHM) ---');
    const { data: cases } = await s.from('cases').select('*').or('deceased_name.ilike.%BHM%,case_number.ilike.%BHM%');
    if (!cases || cases.length === 0) {
        console.log('No BHM case found.');
    } else {
        for (const c of cases) {
            console.log(`Case ${c.id}: ${c.deceased_name} | ${c.case_number} | Status: ${c.status} | Branch: ${c.branch} | Casket: ${c.casket_type}`);
            const { data: moves } = await s.from('stock_movements').select('*').eq('case_id', c.id);
            console.log(`Movements: ${moves ? moves.length : 0}`);
        }
    }

    console.log('\n--- Inventory Diagnostic (Pongee) ---');
    const { data: items } = await s.from('inventory').select('*').ilike('name', '%Pongee%');
    if (!items || items.length === 0) {
        console.log('No Pongee items found.');
    } else {
        items.forEach(i => {
            console.log(`ID: ${i.id} | Name: "${i.name}" | Model: "${i.model}" | Location: ${i.location} | Stock: ${i.stock_quantity} | Reserved: ${i.reserved_quantity}`);
        });
    }
}

diagnostic();
