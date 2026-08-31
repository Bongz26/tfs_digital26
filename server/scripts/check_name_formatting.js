const { query } = require('../config/db');

async function checkNames() {
    try {
        console.log('Checking name formatting for split candidates...');
        const res = await query("SELECT id, name, model, color, category FROM inventory");
        
        const combined = res.rows.filter(r => (r.name || '').includes(' - '));
        console.log(`Found ${combined.length} items with ' - ' in the name.`);
        
        combined.slice(0, 10).forEach(r => {
            console.log(`ID ${r.id}: "${r.name}" (Model: ${r.model})`);
        });

        const distinctModels = [...new Set(res.rows.map(r => r.model).filter(Boolean))];
        console.log('\nDistinct Models in DB:', distinctModels);

        const distinctCategories = [...new Set(res.rows.map(r => r.category).filter(Boolean))];
        console.log('Distinct Categories in DB:', distinctCategories);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkNames();
