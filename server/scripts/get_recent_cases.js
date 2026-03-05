const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function getRecentCases() {
    try {
        const res = await pool.query("SELECT id, case_number, service_date FROM cases ORDER BY id DESC LIMIT 50");
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (e) {
        console.error(e.message);
    } finally {
        await pool.end();
    }
}
getRecentCases();
