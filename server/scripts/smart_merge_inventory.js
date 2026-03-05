const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function smartMerge() {
    try {
        console.log('--- STARTING SMART INVENTORY MERGE ---');

        // 1. Normalize all locations first
        console.log('Standardizing branch locations...');
        await pool.query("UPDATE inventory SET location = 'Head Office' WHERE location ILIKE 'Head Office'");
        await pool.query("UPDATE inventory SET location = 'Makeneng' WHERE location ILIKE 'Makeneng'");
        await pool.query("UPDATE inventory SET location = 'Bethlehem Branch' WHERE location ILIKE 'Bethlehem Branch'");

        // 2. Fetch all inventory items for analysis
        const { rows: items } = await pool.query(`
            SELECT id, name, model, color, category, location, sku, stock_quantity, reserved_quantity, unit_price
            FROM inventory
        `);

        // 3. Group items by logical identity
        const groups = {};
        for (const item of items) {
            const name = (item.name || '').trim().toLowerCase();
            const model = (item.model || '').trim().toLowerCase();
            const color = (item.color || '').trim().toLowerCase();
            const category = (item.category || '').toLowerCase();
            const location = (item.location || '').trim();

            const key = `${name}|${model}|${color}|${category}|${location}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
        }

        console.log(`Analyzed ${items.length} items. Found ${Object.keys(groups).length} unique logical groups.`);

        for (const key in groups) {
            const group = groups[key];
            if (group.length > 1) {
                console.log(`\nDuplicate Group Found: [${key}] (${group.length} items)`);

                // A. Determine the best primary item
                // Priority: 1. No AUTO SKU, 2. Highest stock, 3. Lowest ID
                group.sort((a, b) => {
                    const isGhostA = (a.sku || '').startsWith('AUTO-') ? 1 : 0;
                    const isGhostB = (b.sku || '').startsWith('AUTO-') ? 1 : 0;
                    if (isGhostA !== isGhostB) return isGhostA - isGhostB;
                    if (b.stock_quantity !== a.stock_quantity) return b.stock_quantity - a.stock_quantity;
                    return a.id - b.id;
                });

                const primary = group[0];
                const duplicates = group.slice(1);

                console.log(` - Selected Primary: ID ${primary.id} (SKU: ${primary.sku}, Qty: ${primary.stock_quantity})`);

                for (const dupe of duplicates) {
                    console.log(` - Merging Dupe ID ${dupe.id} (SKU: ${dupe.sku}) into Primary ID ${primary.id}...`);

                    // Re-link movements
                    const moveUpdate = await pool.query(
                        "UPDATE stock_movements SET inventory_id = $1 WHERE inventory_id = $2",
                        [primary.id, dupe.id]
                    );


                    // Combine stock quantities (if they have stock, which they shouldn't usually, but safety first)
                    if (dupe.stock_quantity !== 0 || dupe.reserved_quantity !== 0) {
                        await pool.query(
                            "UPDATE inventory SET stock_quantity = stock_quantity + $1, reserved_quantity = reserved_quantity + $2 WHERE id = $3",
                            [dupe.stock_quantity, dupe.reserved_quantity, primary.id]
                        );
                        console.log(`   - Transfered stock ${dupe.stock_quantity} and reservations ${dupe.reserved_quantity}.`);
                    }

                    // Delete the duplicate
                    await pool.query("DELETE FROM inventory WHERE id = $1", [dupe.id]);
                }
            }
        }

        console.log('\n--- SMART MERGE COMPLETE ---');

    } catch (e) {
        console.error('❌ SMART MERGE FAILED:', e.message);
    } finally {
        await pool.end();
    }
}

smartMerge();
