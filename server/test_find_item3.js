const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY);
const { findOrCreateInventoryItem } = require('./utils/inventoryHelpers');

async function check() {
    console.log = function(...args) {
        fs.appendFileSync('debug_log.txt', args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') + '\n');
    }
    fs.writeFileSync('debug_log.txt', ''); // Clear

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
