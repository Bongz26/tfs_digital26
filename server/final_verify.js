const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { reserveStock, releaseStock } = require('./utils/dbUtils');
const { findOrCreateInventoryItem } = require('./utils/inventoryHelpers');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function verifySystem() {
    console.log('--- Final System Verification ---');
    const testBranch = 'Makeneng';
    const ghostCasket = 'Ghost Test Casket ' + Date.now();

    try {
        // 1. Test Ghost Stock Creation and Reservation
        console.log(`\n1. Testing Ghost Stock reservation for: ${ghostCasket} in ${testBranch}`);
        const item = await findOrCreateInventoryItem(supabase, {
            name: ghostCasket,
            color: 'White',
            branch: testBranch,
            category: 'coffin',
            caseNumber: 'TEST-VERIFY'
        });

        console.log(`✅ Ghost Item created/found with ID: ${item.id}. Stock: ${item.stock_quantity}`);

        // 2. Reserve this item (should succeed even if stock is negative/zero)
        const res = await reserveStock(item.id, 1, 'system-verify', 'Testing relaxation');
        console.log('✅ Reservation successful:', JSON.stringify(res));

        // 3. Verify in DB
        const { data: verify } = await supabase.from('inventory').select('reserved_quantity, stock_quantity').eq('id', item.id).single();
        console.log(`📊 DB State - Stock: ${verify.stock_quantity}, Reserved: ${verify.reserved_quantity}`);

        if (verify.reserved_quantity === 1) {
            console.log('✅ GHOST STOCK RESERVATION VERIFIED.');
        } else {
            throw new Error('Reserved quantity mismatch!');
        }

        // 4. Cleanup
        console.log('\n--- Cleaning up test items ---');
        await releaseStock(item.id, 1, 'system-verify', 'Test cleanup');
        const { error: delErr } = await supabase.from('inventory').delete().eq('id', item.id);
        if (delErr) console.warn('Failed to delete test item:', delErr.message);
        console.log('✅ Cleanup complete.');

    } catch (err) {
        console.error('❌ VERIFICATION FAILED:', err.message);
        process.exit(1);
    }
}

verifySystem();
