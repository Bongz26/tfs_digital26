const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function inspect() {
    try {
        const res = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'stock_movements'
        `);
        console.log('COLUMNS:', res.rows.map(r => r.column_name));
    } catch (e) {
        console.error(e.message);
    } finally {
        await pool.end();
    }
}
inspect();
