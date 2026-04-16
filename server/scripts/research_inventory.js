const { query } = require('../config/db');

async function findDuplicates() {
    try {
        console.log('Searching for potential duplicates/standardization candidates...');
        
        // 1. Find all names, models, colors to see variations
        const res = await query('SELECT name, model, color, location, id FROM inventory');
        
        const map = {};
        res.rows.forEach(row => {
            const key = `${(row.name || '').trim().toUpperCase()}|${(row.model || '').trim().toUpperCase()}|${(row.color || '').trim().toUpperCase()}|${(row.location || '').trim().toUpperCase()}`;
            if (!map[key]) map[key] = [];
            map[key].push(row.id);
        });
        
        console.log('Exact Duplicates (same name, model, color, location):');
        Object.entries(map).forEach(([key, ids]) => {
            if (ids.length > 1) {
                console.log(`${key}: IDs [${ids.join(', ')}]`);
            }
        });

        // 2. Find items that might be the same but with different name formats
        // e.g. "ECONO" vs "ECONO - CASKET"
        console.log('\nPotential Name Inconsistencies:');
        const items = res.rows;
        for (let i = 0; i < items.length; i++) {
            for (let j = i + 1; j < items.length; j++) {
                const a = items[i];
                const b = items[j];
                
                if (a.location === b.location) {
                    const nameA = (a.name || '').toUpperCase();
                    const nameB = (b.name || '').toUpperCase();
                    
                    // Simple check if one name contains the other and they are in the same branch
                    if ((nameA !== nameB) && (nameA.includes(nameB) || nameB.includes(nameA))) {
                         // Check if model also matches or is part of the name
                         console.log(`Potential Match? [${a.location}] ID ${a.id}("${a.name}", "${a.model}") VS ID ${b.id}("${b.name}", "${b.model}")`);
                    }
                }
            }
        }
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

findDuplicates();
