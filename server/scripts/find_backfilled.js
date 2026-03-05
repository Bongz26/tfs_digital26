const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function findBackfilled() {
    try {
        const res = await pool.query(`
            SELECT m.id, m.case_id, c.case_number, m.reason, m.created_at 
            FROM stock_movements m 
            JOIN cases c ON m.case_id = c.id 
            WHERE m.reason LIKE 'Case Completed (backfill)%' 
            ORDER BY m.created_at DESC 
            LIMIT 20
        `);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (e) {
        console.error(e.message);
    } finally {
        await pool.end();
    }
}
findBackfilled();
