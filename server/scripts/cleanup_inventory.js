const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function cleanupInventory() {
    try {
        console.log('--- STARTING INVENTORY CLEANUP ---');

        // 1. Normalize Location Casing (Standardize to 'Head Office' and 'Makeneng')
        console.log('Normalizing location casing...');
        await pool.query("UPDATE inventory SET location = 'Head Office' WHERE location ILIKE 'Head Office'");
        await pool.query("UPDATE inventory SET location = 'Makeneng' WHERE location ILIKE 'Makeneng'");
        await pool.query("UPDATE inventory SET location = 'Bethlehem Branch' WHERE location ILIKE 'Bethlehem Branch'");

        // 2. Identify Ghost Items to Merge
        const ghostItemsRes = await pool.query(`
            SELECT id, name, model, color, category, location, sku 
            FROM inventory 
            WHERE sku LIKE 'AUTO-%'
        `);
        const ghostItems = ghostItemsRes.rows;
        console.log(`Found ${ghostItems.length} ghost items to merge.`);

        for (const ghost of ghostItems) {
            // Find the primary matching item (one without AUTO-* SKU, or earliest ID)
            const primaryMatchRes = await pool.query(`
                SELECT id 
                FROM inventory 
                WHERE name = $1 
                  AND (model = $2 OR (model IS NULL AND $2 = ''))
                  AND (color = $3 OR (color IS NULL AND $3 = ''))
                  AND category = $4 
                  AND location = $5
                  AND (sku IS NULL OR sku NOT LIKE 'AUTO-%')
                ORDER BY id ASC
                LIMIT 1
            `, [ghost.name, ghost.model, ghost.color, ghost.category, ghost.location]);

            if (primaryMatchRes.rows.length > 0) {
                const primaryId = primaryMatchRes.rows[0].id;
                console.log(`Merging Ghost ID ${ghost.id} into Primary ID ${primaryId} (${ghost.name})`);

                // A. Update stock movements to point to primary ID
                const moveUpdate = await pool.query(
                    "UPDATE stock_movements SET inventory_id = $1 WHERE inventory_id = $2",
                    [primaryId, ghost.id]
                );
                console.log(` - Re-linked ${moveUpdate.rowCount} stock movements.`);

                // B. Delete the ghost item
                await pool.query("DELETE FROM inventory WHERE id = $1", [ghost.id]);
                console.log(` - Deleted ghost item ${ghost.id}.`);
            } else {
                console.log(`⚠️ No primary match found for Ghost ID ${ghost.id} (${ghost.name} - ${ghost.location}). Keeping it for now but normalizing SKU...`);
                // If it's the only one, maybe remove the AUTO prefix if they want to keep it? 
                // For now, just leave it as is but it's a "ghost" with no parent.
            }
        }

        console.log('\n--- CLEANUP COMPLETE ---');

    } catch (err) {
        console.error('❌ CLEANUP FAILED:', err.message);
    } finally {
        await pool.end();
    }
}

cleanupInventory();
