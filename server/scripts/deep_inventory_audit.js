require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function deepAudit() {
    try {
        console.log('--- DEEP INVENTORY AUDIT ---');

        const res = await pool.query(`
            SELECT id, name, model, color, category, location, sku, stock_quantity, reserved_quantity, notes
            FROM inventory
            WHERE name ILIKE '%1/4 View%'
            ORDER BY location, id
        `);

        console.log(`Total 1/4 View items: ${res.rows.length}`);
        console.table(res.rows.map(r => ({
            id: r.id,
            name: r.name,
            model: r.model,
            color: r.color,
            loc: r.location,
            sku: r.sku,
            qty: `${r.stock_quantity}/${r.reserved_quantity}`,
            has_auto: (r.sku || '').startsWith('AUTO-')
        })));

    } catch (e) {
        console.error(e.message);
    } finally {
        await pool.end();
    }
}

deepAudit();
