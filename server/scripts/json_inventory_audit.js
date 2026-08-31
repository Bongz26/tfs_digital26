require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function jsonAudit() {
    try {
        const res = await pool.query(`
            SELECT id, name, model, color, category, location, sku, stock_quantity, reserved_quantity, notes
            FROM inventory
            WHERE name ILIKE '%1/4 View%'
            ORDER BY id ASC
        `);

        console.log(JSON.stringify(res.rows, null, 2));

    } catch (e) {
        console.error(e.message);
    } finally {
        await pool.end();
    }
}

jsonAudit();
