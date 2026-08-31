const { query } = require('../config/db');

async function findGhostStock() {
    try {
        console.log('Searching for Ghost Stock...');
        const sql = `
            SELECT id, name, model, color, location, stock_quantity, reserved_quantity, sku, notes 
            FROM inventory 
            WHERE notes LIKE '%Auto-created%' 
               OR sku LIKE 'AUTO-%' 
               OR stock_quantity < 0
        `;
        const res = await query(sql);
        console.log(`Found ${res.rows.length} potential ghost stock items.`);
        console.log(JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

findGhostStock();
