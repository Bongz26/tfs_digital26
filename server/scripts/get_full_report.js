const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function getFullReport() {
    try {
        const query = `
            SELECT id, case_number, service_date, casket_type, branch
            FROM cases
            WHERE status = 'completed'
              AND service_date >= '2026-02-16'
              AND service_date <= '2026-02-23'
            ORDER BY service_date, id
        `;
        const cases = await pool.query(query);

        console.log(`Found ${cases.rows.length} cases.`);

        const results = [];
        for (const c of cases.rows) {
            const movs = await pool.query(
                "SELECT reason, movement_type, quantity_change FROM stock_movements WHERE case_id = $1",
                [c.id]
            );

            results.push({
                case_number: c.case_number,
                service_date: c.service_date.toISOString().split('T')[0],
                casket_type: c.casket_type,
                branch: c.branch,
                movements: movs.rows
            });
        }

        const fs = require('fs');
        fs.writeFileSync('scripts/full_backfill_report.json', JSON.stringify(results, null, 2));
        console.log('✅ Full report written to scripts/full_backfill_report.json');
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

getFullReport();
