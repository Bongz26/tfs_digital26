const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function verifyFinalReport() {
    try {
        console.log('--- FINAL BACKFILL VERIFICATION REPORT ---');

        const cases = await pool.query(`
            SELECT id, case_number, service_date, branch, casket_type
            FROM cases
            WHERE status = 'completed'
              AND service_date >= '2026-02-16'
              AND service_date <= '2026-02-23'
            ORDER BY service_date, id
        `);

        console.log(`\nChecked ${cases.rows.length} cases.`);

        for (const c of cases.rows) {
            const movs = await pool.query(`
                SELECT m.id as movement_id, i.id as inventory_id, i.name as inventory_name, i.location, m.reason, m.created_at
                FROM stock_movements m
                JOIN inventory i ON m.inventory_id = i.id
                WHERE m.case_id = $1
                  AND m.reason LIKE '%backfill%'
            `, [c.id]);

            if (movs.rows.length > 0) {
                const m = movs.rows[0];
                console.log(`✅ Case ${c.case_number}: Backfilled successfully.`);
                console.log(`   - Inventory: ${m.inventory_name} (ID: ${m.inventory_id}) at ${m.location}`);
                console.log(`   - Movement ID: ${m.movement_id}, Date: ${m.created_at.toISOString()}`);
            } else {
                console.log(`⚠️ Case ${c.case_number}: No backfill movement found. (Casket: ${c.casket_type || 'NONE'})`);
            }
        }

        console.log('\n--- INVENTORY STATUS (Standardized Items) ---');
        const inv = await pool.query(`
            SELECT id, name, location, stock_quantity, reserved_quantity
            FROM inventory
            WHERE id IN (
                SELECT DISTINCT inventory_id 
                FROM stock_movements 
                WHERE reason LIKE '%backfill%'
            )
        `);
        console.table(inv.rows);

    } catch (e) {
        console.error(e.message);
    } finally {
        await pool.end();
    }
}

verifyFinalReport();
