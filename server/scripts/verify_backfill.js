const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function verifyAll() {
    try {
        console.log('--- VERIFYING BACKFILL DATA ---');
        console.log('Connection:', process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':***@'));

        const cases = await pool.query(`
            SELECT id, case_number, service_date, casket_type, branch
            FROM cases
            WHERE status = 'completed'
              AND service_date >= '2026-02-16'
              AND service_date <= '2026-02-23'
            ORDER BY service_date, id
        `);

        console.log(`\nFound ${cases.rows.length} cases in range:`);

        for (const c of cases.rows) {
            const movs = await pool.query(
                "SELECT id, reason, created_at FROM stock_movements WHERE case_id = $1",
                [c.id]
            );

            console.log(`Case ${c.case_number} (ID=${c.id}):`);
            if (movs.rows.length === 0) {
                console.log('  ❌ No movements found.');
            } else {
                movs.rows.forEach(m => {
                    console.log(`  ✅ Movement ID=${m.id}, Reason="${m.reason}", Date=${m.created_at.toISOString()}`);
                });
            }
        }
    } catch (e) {
        console.error(e.message);
    } finally {
        await pool.end();
    }
}

verifyAll();
