const { query } = require('../config/db');

async function cleanupInventory() {
    try {
        console.log('--- Inventory Cleanup & Consolidation ---');
        
        // 1. Fetch all items
        const res = await query('SELECT * FROM inventory');
        const items = res.rows;
        
        // 2. Normalize and Split names that have " - "
        let splitCount = 0;
        for (const item of items) {
            if (item.name && item.name.includes(' - ')) {
                const parts = item.name.split(' - ');
                const newName = parts[0].trim().toUpperCase();
                const newModel = parts[1].trim().toUpperCase();
                
                console.log(`Splitting ID ${item.id}: "${item.name}" -> Name: "${newName}", Model: "${newModel}"`);
                await query('UPDATE inventory SET name = $1, model = $2 WHERE id = $3', [newName, newModel, item.id]);
                
                // Update local object for the next phase
                item.name = newName;
                item.model = newModel;
                splitCount++;
            }
        }
        console.log(`Step 1 Complete: Split ${splitCount} item names.`);

        // 3. Find and Merge Duplicates
        // Group by Normalized (Name, Model, Color, Location)
        const groups = {};
        for (const item of items) {
            const key = `${(item.name || '').trim().toUpperCase()}|${(item.model || '').trim().toUpperCase()}|${(item.color || '').trim().toUpperCase()}|${(item.location || '').trim().toUpperCase()}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
        }

        let mergeCount = 0;
        for (const [key, group] of Object.entries(groups)) {
            if (group.length > 1) {
                console.log(`\nFound group of ${group.length} duplicates for [${key}]`);
                
                // Sort by ID (usually oldest is original) or those with existing notes/good SKU
                // We'll prefer the one that is NOT a ghost stock (sku doesn't start with AUTO-)
                group.sort((a, b) => {
                    const aIsGhost = (a.sku || '').startsWith('AUTO-');
                    const bIsGhost = (b.sku || '').startsWith('AUTO-');
                    if (aIsGhost && !bIsGhost) return 1;
                    if (!aIsGhost && bIsGhost) return -1;
                    return a.id - b.id; // Older first
                });

                const parent = group[0];
                const duplicates = group.slice(1);

                for (const dupe of duplicates) {
                    console.log(`Merging ID ${dupe.id} into Parent ID ${parent.id}...`);
                    
                    // Sum up quantities
                    const newStock = (parseInt(parent.stock_quantity) || 0) + (parseInt(dupe.stock_quantity) || 0);
                    const newReserved = (parseInt(parent.reserved_quantity) || 0) + (parseInt(dupe.reserved_quantity) || 0);
                    
                    // Update parent
                    await query('UPDATE inventory SET stock_quantity = $1, reserved_quantity = $2 WHERE id = $3', [newStock, newReserved, parent.id]);
                    parent.stock_quantity = newStock;
                    parent.reserved_quantity = newReserved;

                    // Delete dupe
                    await query('DELETE FROM inventory WHERE id = $1', [dupe.id]);
                    mergeCount++;
                }
            }
        }
        
        console.log(`\nStep 2 Complete: Merged ${mergeCount} duplicate items.`);
        process.exit(0);
    } catch (e) {
        console.error('Error during cleanup:', e);
        process.exit(1);
    }
}

cleanupInventory();
