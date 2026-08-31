const { query } = require('../config/db');

async function checkId321() {
    try {
        console.log('--- Checking Inventory ID 321 and Movements ---');
        
        const res = await query("SELECT * FROM inventory WHERE id = 321");
        if (res.rows.length > 0) {
            console.log('Item 321 exists:', JSON.stringify(res.rows[0], null, 2));
        } else {
            console.log('Item 321 DOES NOT EXIST in inventory table.');
            
            // Search for it in stock movements to see where it went
            console.log('\nScanning stock_movements for inventory_id = 321 or references to TRF-2026-032...');
            const movRes = await query(`
                SELECT * FROM stock_movements 
                WHERE inventory_id = 321 
                   OR reason ILIKE '%TRF-2026-032%'
                ORDER BY created_at DESC
            `);
            console.log(`Found ${movRes.rows.length} movement records.`);
            movRes.rows.forEach(m => {
                console.log(`- [${m.movement_type}] Qty: ${m.quantity_change}, Reason: ${m.reason}, Date: ${m.created_at}, ItemID: ${m.inventory_id}`);
            });
        }

        // Check if ANY item in Makeneng has "ECONO" in the name or model now
        console.log('\nAll items in Makeneng currently:');
        const allMakeneng = await query("SELECT id, name, model, color, stock_quantity FROM inventory WHERE location ILIKE '%Makeneng%'");
        allMakeneng.rows.forEach(i => {
           console.log(`- ID: ${i.id}, ${i.name} ${i.model} ${i.color}: ${i.stock_quantity}`);
        });

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkId321();
