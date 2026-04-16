const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env' });
const { findOrCreateInventoryItem } = require('../utils/inventoryHelpers');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function verifyTransferLogic() {
    try {
        console.log('--- Verifying Stock Transfer Matching Logic ---');
        
        // Scenario 1: Standardized Incoming Transfer
        // TRF-2026-035 has name: "Pongee", model: "CASKET", color: "CHERRY"
        console.log('\nScenario 1: Standardized Incoming ("Pongee", "CASKET", "CHERRY")');
        const item1 = await findOrCreateInventoryItem(supabase, {
            name: "Pongee",
            model: "CASKET",
            color: "CHERRY",
            branch: "Head Office",
            category: "coffin"
        });
        console.log(`Matched ID: ${item1.id} (${item1.name} ${item1.model} ${item1.color})`);
        if (item1.id === 134) console.log('✅ SUCCESS: Matched standardized ID 134');
        else console.log('❌ FAILURE: Did not match ID 134');

        // Scenario 2: Legacy Incoming Transfer (created before standardization)
        // name: "PONGEE - CASKET", model: null, color: "CHERRY"
        console.log('\nScenario 2: Legacy Incoming ("PONGEE - CASKET", null, "CHERRY")');
        const item2 = await findOrCreateInventoryItem(supabase, {
            name: "PONGEE - CASKET",
            model: null,
            color: "CHERRY",
            branch: "Head Office",
            category: "coffin"
        });
        console.log(`Matched ID: ${item2.id} (${item2.name} ${item2.model} ${item2.color})`);
        if (item2.id === 134) console.log('✅ SUCCESS: Matched standardized ID 134 via auto-split');
        else console.log('❌ FAILURE: Did not match ID 134 via auto-split');

        // Scenario 3: Mixed Case/Whitespace
        console.log('\nScenario 3: Mixed Case ("  pongee  ", "  Casket  ", "cherry")');
        const item3 = await findOrCreateInventoryItem(supabase, {
            name: "  pongee  ",
            model: "  Casket  ",
            color: "cherry",
            branch: "Head Office",
            category: "coffin"
        });
        console.log(`Matched ID: ${item3.id} (${item3.name} ${item3.model} ${item3.color})`);
        if (item3.id === 134) console.log('✅ SUCCESS: Matched standardized ID 134 via normalization');
        else console.log('❌ FAILURE: Did not match ID 134 via normalization');

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

verifyTransferLogic();
