const { query } = require('../config/db');

async function investigate() {
    try {
        console.log('--- Investigating Missing ECONO CASKET CHERRY ---');
        
        // 1. Search Stock Transfers to Makeneng
        console.log('\nScanning Stock Transfers to Makeneng...');
        const trfRes = await query(`
            SELECT id, transfer_number, from_location, to_location, items, status, created_at, received_at 
            FROM stock_transfers 
            WHERE to_location ILIKE '%Makeneng%' 
            ORDER BY created_at DESC 
            LIMIT 20
        `);
        
        const transfers = trfRes.rows;
        let foundTrf = false;
        transfers.forEach(t => {
            const itemsMatch = JSON.stringify(t.items).toLowerCase().includes('econo');
            if (itemsMatch) {
                foundTrf = true;
                console.log(`\n[${t.status.toUpperCase()}] ${t.transfer_number}: ${t.from_location} -> ${t.to_location}`);
                console.log(`  Items: ${JSON.stringify(t.items)}`);
                console.log(`  Created: ${t.created_at}, Received: ${t.received_at}`);
            }
        });
        if (!foundTrf) console.log('No ECONO transfers found to Makeneng in recent 20.');

        // 2. Search Inventory in Makeneng
        console.log('\nScanning Inventory in Makeneng for ECONO...');
        const invRes = await query(`
            SELECT id, name, model, color, location, stock_quantity, reserved_quantity 
            FROM inventory 
            WHERE location ILIKE '%Makeneng%' 
              AND (name ILIKE '%ECONO%' OR model ILIKE '%ECONO%')
        `);
        
        if (invRes.rows.length === 0) {
            console.log('No items found in Makeneng matching ECONO.');
        } else {
            invRes.rows.forEach(i => {
                console.log(`- ID: ${i.id}, Name: ${i.name}, Model: ${i.model}, Color: ${i.color}, Location: ${i.location}, Stock: ${i.stock_quantity}`);
            });
        }

        // 3. Search for ANY ECONO CHERRY in case location is slightly different
        console.log('\nScanning ALL Inventory for ECONO + CHERRY...');
        const allRes = await query(`
            SELECT id, name, model, color, location, stock_quantity 
            FROM inventory 
            WHERE (name ILIKE '%ECONO%' OR model ILIKE '%ECONO%')
              AND (color ILIKE '%CHERRY%' OR name ILIKE '%CHERRY%')
        `);
        allRes.rows.forEach(i => {
           console.log(`- ID: ${i.id}, [${i.location}] ${i.name} ${i.model} ${i.color}: ${i.stock_quantity}`);
        });

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

investigate();
