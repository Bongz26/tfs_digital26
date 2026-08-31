const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function getCasesInRange() {
    try {
        const res = await pool.query(`
            SELECT id, case_number, service_date, status 
            FROM cases 
            WHERE service_date >= '2026-02-16' AND service_date <= '2026-02-23' 
            ORDER BY id
        `);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (e) {
        console.error(e.message);
    } finally {
        await pool.end();
    }
}
getCasesInRange();
