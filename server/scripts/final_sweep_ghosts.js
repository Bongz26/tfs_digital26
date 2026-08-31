const { query } = require('../config/db');

async function finalSweep() {
    try {
        console.log('--- Final Ghost Stock Sweep ---');
        
        // The 7 remaining ghosts based on our previous scan
        const ghosts = [314, 356, 354, 359, 357, 322, 328];
        const res = await query('SELECT * FROM inventory WHERE id = ANY($1)', [ghosts]);
        const ghostItems = res.rows;
        
        console.log(`Analyzing ${ghostItems.length} ghost items...`);
        
        const allRes = await query('SELECT * FROM inventory');
        const allItems = allRes.rows;

        for (const ghost of ghostItems) {
            console.log(`\nAnalyzing Ghost ID ${ghost.id}: "${ghost.name}" (${ghost.model}, ${ghost.color}) at ${ghost.location}`);
            
            // Look for a "Real" item in the same branch that matches name and model
            // Priority 1: Match Name, Model, and Color
            // Priority 2: Match Name and Model (if ghost color is empty)
            let parent = allItems.find(i => 
                i.id !== ghost.id &&
                i.location === ghost.location &&
                i.name === ghost.name &&
                i.model === ghost.model &&
                (ghost.color ? i.color === ghost.color : true) &&
                !(i.sku || '').startsWith('AUTO-')
            );
            
            // If still no parent, try to match just Name and Model in the same branch
            if (!parent) {
                parent = allItems.find(i => 
                    i.id !== ghost.id &&
                    i.location === ghost.location &&
                    i.name === ghost.name &&
                    i.model === ghost.model &&
                    !(i.sku || '').startsWith('AUTO-')
                );
            }

            if (parent) {
                console.log(`>>> MATCH FOUND: Parent ID ${parent.id} ("${parent.name}", "${parent.model}", "${parent.color}")`);
                
                const newStock = (parseInt(parent.stock_quantity) || 0) + (parseInt(ghost.stock_quantity) || 0);
                const newReserved = (parseInt(parent.reserved_quantity) || 0) + (parseInt(ghost.reserved_quantity) || 0);
                
                console.log(`Merging: New Stock=${newStock}, New Reserved=${newReserved}`);
                
                await query('UPDATE inventory SET stock_quantity = $1, reserved_quantity = $2 WHERE id = $3', [newStock, newReserved, parent.id]);
                await query('DELETE FROM inventory WHERE id = $1', [ghost.id]);
                console.log(`✅ ID ${ghost.id} merged and removed.`);
            } else {
                console.log(`❌ No suitable parent found in ${ghost.location}. This item will remain but is now standardized.`);
            }
        }
        
        console.log('\n--- Final Sweep Complete ---');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

finalSweep();
