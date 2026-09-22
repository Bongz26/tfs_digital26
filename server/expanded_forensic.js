const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function expandedAnalyze() {
    console.log('--- Expanded Forensic Analysis ---');

    // 1. Find all items matching "Poper" or "Pongee"
    const { data: items } = await supabase
        .from('inventory')
        .select('*')
        .or('name.ilike.%Poper%,name.ilike.%Pongee%');

    console.log(`Found ${items.length} items:`);
    items.forEach(i => {
        console.log(`ID: ${i.id} | Name: ${i.name} | Branch: ${i.location} | Stock: ${i.stock_quantity} | Reserved: ${i.reserved_quantity}`);
    });

    const itemIds = items.map(i => i.id);

    // 2. All movements for these items
    const { data: movements } = await supabase
        .from('stock_movements')
        .select('*')
        .in('inventory_id', itemIds)
        .order('created_at', { ascending: true });

    console.log('\n--- Movements ---');
    movements.forEach(m => {
        console.log(`[${m.created_at}] Item: ${m.inventory_id} | Type: ${m.movement_type} | Change: ${m.quantity_change} | Case: ${m.case_id} | Reason: ${m.reason}`);
    });

    // 3. Case 49 Details
    const { data: case49 } = await supabase
        .from('cases')
        .select('*')
        .eq('id', 49)
        .single();

    if (case49) {
        console.log('\n--- Case 49 Details ---');
        console.log(`Case Number: ${case49.case_number} | Deceased: ${case49.deceased_name} | Status: ${case49.status} | Branch: ${case49.branch}`);
        console.log(`Casket: ${case49.casket_type} | Color: ${case49.casket_colour}`);
    }

    // 4. Case 49 History (Audit Log)
    const { data: audit } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('record_id', '49')
        .eq('table_name', 'cases')
        .order('created_at', { ascending: true });

    if (audit) {
        console.log('\n--- Audit Log for Case 49 ---');
        audit.forEach(a => {
            console.log(`[${a.created_at}] Action: ${a.action} | User: ${a.user_email} | Changes: ${JSON.stringify(a.changes)}`);
        });
    }
}

expandedAnalyze();
