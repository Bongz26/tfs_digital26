const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function getActualBackfilled() {
    try {
        const query = `
            SELECT m.case_id, c.case_number, c.service_date, m.reason, m.created_at
            FROM stock_movements m
            JOIN cases c ON m.case_id = c.id
            WHERE m.reason LIKE 'Case Completed (backfill)%'
            ORDER BY m.created_at DESC
        `;
        const res = await pool.query(query);

        console.log(`Found ${res.rows.length} backfilled movements.`);

        const fs = require('fs');
        fs.writeFileSync('scripts/actual_backfilled_results.json', JSON.stringify(res.rows, null, 2));
        console.log('✅ Actual backfilled results written to scripts/actual_backfilled_results.json');
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

getActualBackfilled();
