const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function auditAllReservations() {
    console.log('--- AUDITING ALL RESERVATIONS ---');

    // 1. Get all items with reserved_quantity > 0
    const { data: items } = await supabase.from('inventory').select('id, name, location, reserved_quantity').gt('reserved_quantity', 0);

    // 2. Get all active entries in the reservations table
    const { data: reservations } = await supabase.from('reservations').select('*, inventory(name, location), cases(case_number, status, deceased_name)').is('released_at', null);

    const issues = [];

    // Check for items with reserved_quantity but no reservation record
    for (const item of items) {
        const totalReservedInTable = reservations
            .filter(r => r.inventory_id === item.id)
            .reduce((sum, r) => sum + r.quantity, 0);

        if (item.reserved_quantity !== totalReservedInTable) {
            issues.push(`Mismatch on Item ${item.id} (${item.name} at ${item.location}): Inventory has ${item.reserved_quantity}, Table has ${totalReservedInTable}`);
        }
    }

    // Check for reservations tied to non-active cases
    for (const r of reservations) {
        if (!r.cases || ['cancelled', 'completed'].includes(r.cases.status)) {
            issues.push(`Reservation ${r.id} for item ${r.inventory_id} is tied to case ${r.cases ? r.cases.case_number : 'MISSING'} which has status ${r.cases ? r.cases.status : 'N/A'}`);
        }
    }

    if (issues.length === 0) {
        console.log('✅ ALL RESERVATIONS ARE ACCURATE AND VALIDATED.');
    } else {
        console.log('❌ ISSUES FOUND:');
        issues.forEach(issue => console.log(' - ' + issue));
    }

    console.log('\nSummary of current valid reservations:');
    reservations.forEach(r => {
        console.log(` - Case: ${r.cases ? r.cases.case_number : 'N/A'} (${r.cases ? r.cases.deceased_name : 'N/A'}) -> ${r.inventory ? r.inventory.name : 'N/A'} at ${r.inventory ? r.inventory.location : 'N/A'}`);
    });
}

auditAllReservations();
