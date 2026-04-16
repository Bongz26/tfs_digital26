const { createClient } = require('@supabase/supabase-js');
const { findOrCreateInventoryItem } = require('./utils/inventoryHelpers');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY);

async function fix() {
    console.log("Fetching all active cases...");
    const { data: cases, error } = await supabase
        .from('cases')
        .select('id, case_number, status, casket_type, casket_colour, branch')
        .not('status', 'in', '("completed","cancelled","archived")');

    if (error) {
        console.error("Error fetching cases:", error);
        return;
    }

    console.log(`Found ${cases.length} active cases.`);
    
    // Map of item_id -> reserved count
    const reservations = {};

    for (let c of cases) {
        if (!c.casket_type) continue;
        
        let primaryName = c.casket_type.trim();
        let modelMatch = null;
        if (primaryName.includes(' - ')) {
            const lastDashIndex = primaryName.lastIndexOf(' - ');
            modelMatch = primaryName.substring(lastDashIndex + 3).trim();
            primaryName = primaryName.substring(0, lastDashIndex).trim();
            // Just use findOrCreate to get the target ID
        }
        
        const branch = c.branch || 'Head Office';
        const item = await findOrCreateInventoryItem(supabase, {
            name: c.casket_type,
            color: c.casket_colour,
            branch: branch,
            category: 'coffin',
            caseNumber: c.case_number
        });
        
        if (item) {
            reservations[item.id] = (reservations[item.id] || 0) + 1;
        }
    }
    
    console.log("Calculated reservations:", Object.entries(reservations).length, "items have reserved stock.");
    
    // Fetch all current inventory to compare
    const { data: inv } = await supabase.from('inventory').select('id, reserved_quantity, name, location').eq('category', 'coffin');
    
    let updates = 0;
    for (let i of inv) {
        const correctRes = reservations[i.id] || 0;
        if (i.reserved_quantity !== correctRes) {
            console.log(`Fixing ${i.name} in ${i.location} (ID: ${i.id}): ${i.reserved_quantity} -> ${correctRes}`);
            await supabase.from('inventory').update({ reserved_quantity: correctRes }).eq('id', i.id);
            updates++;
        }
    }
    
    console.log(`Total items needing fix: ${updates}`);
}

fix();
