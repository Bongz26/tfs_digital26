const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const fs = require('fs');
let output = '';
const log = (msg) => { output += msg + '\n'; console.log(msg); };

async function main() {
    try {
        log('--- Inventory Schema Check ---');
        const colRes = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'inventory'
        `);
        log('Columns: ' + colRes.rows.map(c => `${c.column_name} (${c.data_type})`).join(', '));

        log('\n--- Duplicate Detection (1/4 View) ---');
        const items = await pool.query(`
            SELECT id, name, model, color, category, location, stock_quantity, reserved_quantity, sku, notes
            FROM inventory
            WHERE name ILIKE '%1/4 View%'
            ORDER BY name, location, color
        `);

        items.rows.forEach(r => {
            log(`ID: ${r.id} | Name: ${r.name} | Model: ${r.model} | Color: ${r.color} | Loc: ${r.location} | Qty: ${r.stock_quantity}/${r.reserved_quantity} | SKU: ${r.sku} | Notes: ${r.notes}`);
        });

        log('\n--- All Unique Locations and Counts ---');
        const locations = await pool.query(`
            SELECT location, count(*) 
            FROM inventory 
            GROUP BY location 
            ORDER BY location
        `);
        locations.rows.forEach(r => {
            log(`- ${r.location}: ${r.count}`);
        });

        fs.writeFileSync('scripts/inventory_audit.txt', output);
        console.log('\n✅ Detailed audit saved to scripts/inventory_audit.txt');

    } catch (e) {
        console.error('Error:', e.message);
    } finally {
        await pool.end();
    }
}

main();
