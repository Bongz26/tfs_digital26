const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function getCase166() {
    try {
        const res = await pool.query("SELECT id, case_number, service_date FROM cases WHERE id = 166");
        console.log('CASE 166:', JSON.stringify(res.rows[0], null, 2));
    } catch (e) {
        console.error(e.message);
    } finally {
        await pool.end();
    }
}
getCase166();
