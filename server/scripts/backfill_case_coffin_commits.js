const { query } = require('../config/db');
const { getSupabaseClient, commitStock } = require('../utils/dbUtils');
const { findOrCreateInventoryItem } = require('../utils/inventoryHelpers');

/**
 * One-off script to backfill coffin stock commits for cases whose status
 * was bulk-updated to 'completed' directly in SQL.
 *
 * It mimics the logic in casesController:
 * - For each completed case, find/create the coffin inventory item
 *   for that branch (ghost stock if missing).
 * - Call commit_stock once per case to deduct 1 coffin.
 * - Skips cases that already have a negative 'sale' movement in stock_movements.
 */

async function main() {
    // Adjust dates if needed
    const FROM_DATE = '2026-02-16';
    const TO_DATE = '2026-02-23';

    console.log('🔎 Backfilling coffin commits for completed cases between', FROM_DATE, 'and', TO_DATE);

    const supabase = getSupabaseClient();
    if (!supabase) {
        throw new Error('Supabase client is not configured (check SUPABASE_URL and SUPABASE_SERVICE_KEY)');
    }

    // 1) Fetch candidate cases
    const casesRes = await query(
        `
        SELECT id, case_number, casket_type, casket_colour, branch, service_date, status
        FROM cases
        WHERE status = 'completed'
          AND service_date >= $1
          AND service_date <= $2
        ORDER BY service_date, id
        `,
        [FROM_DATE, TO_DATE]
    );

    const rows = casesRes.rows || [];
    console.log(`📦 Found ${rows.length} completed cases in date range.`);

    let processed = 0;
    let skippedNoCasket = 0;
    let skippedAlreadyCommitted = 0;
    let committed = 0;
    let errors = 0;

    for (const c of rows) {
        const caseId = c.id;
        const caseNumber = c.case_number;
        const nameStr = String(c.casket_type || '').trim();
        const colorStr = String(c.casket_colour || '').trim();
        const branch = c.branch || 'Head Office';

        processed++;

        if (!nameStr) {
            skippedNoCasket++;
            console.log(`↩️  Case ${caseNumber} (id=${caseId}) has no casket_type, skipping.`);
            continue;
        }

        // 2) Check if we already committed stock for this case
        const movRes = await query(
            `
            SELECT 1
            FROM stock_movements
            WHERE case_id = $1
              AND movement_type = 'sale'
              AND quantity_change < 0
            LIMIT 1
            `,
            [caseId]
        );

        if (movRes.rows.length > 0) {
            skippedAlreadyCommitted++;
            console.log(`✅ Case ${caseNumber} already has a committed coffin movement, skipping.`);
            continue;
        }

        // 3) Find or create the inventory item (same helper used by API)
        let inv;
        try {
            inv = await findOrCreateInventoryItem(supabase, {
                name: nameStr,
                color: colorStr,
                branch,
                category: 'coffin',
                caseNumber
            });
        } catch (e) {
            errors++;
            console.error(`❌ Failed to find/create inventory for case ${caseNumber} (id=${caseId}):`, e.message);
            continue;
        }

        if (!inv) {
            errors++;
            console.error(`❌ No inventory item resolved for case ${caseNumber} (id=${caseId}), skipping.`);
            continue;
        }

        // 4) Commit 1 coffin from this inventory item
        try {
            const result = await commitStock(inv.id, 1, caseId, 'backfill-script', `Case Completed (backfill): ${caseNumber}`);
            committed++;
            console.log(`💾 Committed 1 coffin for case ${caseNumber} (id=${caseId}) from inventory ${inv.id}: ${result?.message || ''}`);
        } catch (e) {
            errors++;
            console.error(`❌ CommitStock failed for case ${caseNumber} (id=${caseId}), inventory ${inv.id}:`, e.message);
        }
    }

    console.log('🎯 Backfill summary:');
    console.log('  Processed cases      :', processed);
    console.log('  Skipped (no casket)  :', skippedNoCasket);
    console.log('  Skipped (already committed):', skippedAlreadyCommitted);
    console.log('  Successfully committed:', committed);
    console.log('  Errors               :', errors);
}

main()
    .then(() => {
        console.log('✅ Backfill script completed.');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Backfill script failed:', err);
        process.exit(1);
    });

