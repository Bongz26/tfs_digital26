const { createClient } = require('@supabase/supabase-js');
const { findOrCreateInventoryItem } = require('./server/utils/inventoryHelpers');
require('dotenv').config({ path: './server/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

(async () => {
    try {
        console.log("Testing findOrCreateInventoryItem...");
        const result = await findOrCreateInventoryItem(supabase, {
            name: "4 TIER - CASKET",
            color: "ASH",
            branch: "Head Office",
            category: "coffin",
            caseNumber: "TEST-123"
        });
        console.log("Result ID:", result ? result.id : null);
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
})();
