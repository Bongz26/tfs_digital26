const { query } = require('../config/db');

async function checkRemaining() {
    try {
        console.log('--- Checking Remaining Ghost Potential ---');
        const ghostSNames = ['ECONO', 'PONGEE', 'FLAT LID'];
        const res = await query('SELECT id, name, model, color, location, stock_quantity, reserved_quantity, sku FROM inventory');
        const allItems = res.rows;
        
        for (const name of ghostSNames) {
            console.log(`\nItems matching "${name}":`);
            const filtered = allItems.filter(i => (i.name || '').toUpperCase().includes(name));
            filtered.forEach(i => {
                console.log(`ID ${i.id}: [${i.location}] "${i.name}" (${i.model || ''}, ${i.color || ''}) SKU: ${i.sku} Stock: ${i.stock_quantity} Res: ${i.reserved_quantity}`);
            });
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkRemaining();
