const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY);
const { findOrCreateInventoryItem } = require('./utils/inventoryHelpers');

async function check() {
    // Mimic exactly what casesController does when updating status for Case THS-2026-111
    // The user selected "1/4 View - CASKET" with "KIAAT" at "Head Office"
    const invItem = await findOrCreateInventoryItem(supabase, {
        name: "1/4 View - CASKET",
        color: "KIAAT",
        branch: "Head Office",
        category: 'coffin',
        caseNumber: 'THS-2026-TEST'
    });
    console.log("Returned item:", invItem);
}

check();
