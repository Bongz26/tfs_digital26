const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function findTFS() {
    try {
        const tfs = await pool.query("SELECT id, case_number, service_date FROM cases WHERE case_number LIKE 'TFS-BHE%'");
        console.log('--- TFS-BHE CASES ---');
        console.log(JSON.stringify(tfs.rows, null, 2));

        const movs = await pool.query("SELECT * FROM stock_movements WHERE created_at >= CURRENT_DATE");
        console.log('\n--- STOCK MOVEMENTS TODAY ---');
        console.log(JSON.stringify(movs.rows, null, 2));
    } catch (e) {
        console.error(e.message);
    } finally {
        await pool.end();
    }
}
findTFS();
