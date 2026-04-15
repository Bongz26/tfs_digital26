const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const { findOrCreateInventoryItem } = require('./utils/inventoryHelpers');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    try {
        console.log("WAIT FIRST: let's test findItem with separate Name/Model");
        
        // Testing PONGEE CASKET at Head Office (ID 134)
        const item = await findOrCreateInventoryItem(supabase, {
            name: "PONGEE",
            model: "CASKET",
            color: "CHERRY",
            branch: "Head Office",
            category: "coffin",
            caseNumber: "THS-TEST-VERIFY"
        });
        
        console.log("ITEM FOUND:", {
            id: item.id,
            name: item.name,
            model: item.model,
            sku: item.sku,
            stock: item.stock_quantity
        });

        if (item.id === 134) {
            console.log("✅ SUCCESS: Found existing standardized item ID 134");
        } else if (item.sku && item.sku.startsWith('AUTO-')) {
            console.log("❌ FAILURE: Created a ghost stock instead of matching ID 134");
        } else {
            console.log("❓ Found unexpected item ID " + item.id);
        }

    } catch (e) {
        console.error(e);
    }
}

run();
