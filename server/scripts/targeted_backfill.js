const { Pool } = require('pg');
require('dotenv').config();
const { getSupabaseClient, commitStock } = require('../utils/dbUtils');
const { findOrCreateInventoryItem } = require('../utils/inventoryHelpers');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function backfillTargeted() {
    try {
        const caseNumbers = ['THS-2026-053'];
        console.log(`🎯 Targeted backfill for: ${caseNumbers.join(', ')}`);

        const supabase = getSupabaseClient();

        for (const num of caseNumbers) {
            const res = await pool.query("SELECT * FROM cases WHERE case_number = $1", [num]);
            if (res.rows.length === 0) {
                console.log(`❌ Case ${num} not found.`);
                continue;
            }
            const c = res.rows[0];

            console.log(`Processing ${num} (id=${c.id}): ${c.casket_type} at ${c.branch}`);

            const inv = await findOrCreateInventoryItem(supabase, {
                name: c.casket_type,
                color: c.casket_colour,
                branch: c.branch,
                category: 'coffin',
                caseNumber: num
            });

            if (inv) {
                console.log(`Found item ${inv.id} (${inv.name}) at ${inv.location}. Committing...`);
                const commitResult = await commitStock(inv.id, 1, c.id, 'targeted-backfill', `Case Completed (backfill): ${num}`);
                console.log(`✅ Success: ${commitResult.message}`);
            } else {
                console.log(`❌ Failed to resolve inventory for ${num}`);
            }
        }
    } catch (e) {
        console.error('Error:', e.message);
    } finally {
        await pool.end();
    }
}

backfillTargeted();
