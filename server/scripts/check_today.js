const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkToday() {
    try {
        const inv = await pool.query("SELECT id, name, updated_at FROM inventory WHERE updated_at >= CURRENT_DATE");
        console.log('--- UPDATED INVENTORY TODAY ---');
        console.log(JSON.stringify(inv.rows, null, 2));

        const mov = await pool.query("SELECT m.*, c.case_number FROM stock_movements m LEFT JOIN cases c ON m.case_id = c.id WHERE m.created_at >= CURRENT_DATE");
        console.log('\n--- NEW MOVEMENTS TODAY ---');
        console.log(JSON.stringify(mov.rows, null, 2));
    } catch (e) {
        console.error(e.message);
    } finally {
        await pool.end();
    }
}
checkToday();
