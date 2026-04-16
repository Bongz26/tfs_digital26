const { query } = require('./server/config/db');

async function fixInventory() {
    try {
        console.log('Fetching all inventory items...');
        const res = await query('SELECT id, name, model, color FROM inventory');
        
        let updateCount = 0;
        
        for (const row of res.rows) {
            let updated = false;
            let newModel = row.model;
            let newColor = row.color;
            let newName = row.name;
            
            // Fix trailing spaces and casing inconsistences by trimming and standardizing
            if (newModel) {
                const trimmed = newModel.trim().toUpperCase();
                if (trimmed !== newModel) {
                    newModel = trimmed;
                    updated = true;
                }
            }
            
            if (newColor) {
                let trimmed = newColor.trim().toUpperCase();
                // Fix specific spelling mistakes
                if (trimmed === 'CHEERY') {
                    trimmed = 'CHERRY';
                }
                if (trimmed !== newColor) {
                    newColor = trimmed;
                    updated = true;
                }
            }
            
            if (newName) {
                const trimmed = newName.trim();
                // Just trim the name
                if (trimmed !== newName) {
                    newName = trimmed;
                    updated = true;
                }
            }
            
            if (updated) {
                console.log(`Updating ID ${row.id}: model='${row.model}'->'${newModel}', color='${row.color}'->'${newColor}'`);
                await query('UPDATE inventory SET model = $1, color = $2, name = $3 WHERE id = $4', [newModel, newColor, newName, row.id]);
                updateCount++;
            }
        }
        
        console.log(`Finished fixing inventory. Updated ${updateCount} rows.`);
        process.exit(0);
    } catch (e) {
        console.error('Error fixing inventory:', e);
        process.exit(1);
    }
}

fixInventory();
