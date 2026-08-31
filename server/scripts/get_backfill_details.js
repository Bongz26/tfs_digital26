const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function getDetails() {
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

        const results = [];
        for (const c of cases.rows) {
            // Check if backfilled
            const backfillRes = await pool.query(
                "SELECT 1 FROM stock_movements WHERE case_id = $1 AND reason LIKE '%backfill%'",
                [c.id]
            );

            // Check if skipped (already has sale)
            const saleRes = await pool.query(
                "SELECT reason FROM stock_movements WHERE case_id = $1 AND movement_type = 'sale' AND quantity_change < 0 AND reason NOT LIKE '%backfill%'",
                [c.id]
            );

            let status = '';
            let details = '';

            if (backfillRes.rows.length > 0) {
                status = 'Backfilled';
                details = 'Successfully committed 1 coffin';
            } else if (saleRes.rows.length > 0) {
                status = 'Skipped';
                details = `Already had commit: "${saleRes.rows[0].reason}"`;
            } else {
                status = 'Unknown';
                details = 'No backfill or existing sale found (check casket_type)';
            }

            results.push({
                case_number: c.case_number,
                service_date: c.service_date.toISOString().split('T')[0],
                casket_type: c.casket_type,
                branch: c.branch,
                status: status,
                details: details
            });
        }
        const fs = require('fs');
        fs.writeFileSync('scripts/backfill_results.json', JSON.stringify(results, null, 2));
        console.log('✅ Results written to scripts/backfill_results.json');
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

getDetails();
