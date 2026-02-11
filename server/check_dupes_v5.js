process.env.DATABASE_URL = 'postgresql://postgres:thusanang@db.uucjdcbtpunfsyuixsmc.supabase.co:5432/postgres';

const { query } = require('./config/db');

async function run() {
    try {
        console.log('🔍 Checking for duplicate inventory items...');
        const res = await query(`
            SELECT name, location, COUNT(*) as count
            FROM inventory 
            GROUP BY name, location 
            HAVING COUNT(*) > 1
        `);

        console.log(`\nFound ${res.rows.length} duplicate groups.`);

        if (res.rows.length > 0) {
            console.table(res.rows);

            const details = await query(`
                SELECT id, name, location, stock_quantity, created_at, category 
                FROM inventory 
                WHERE (name, location) IN (
                    SELECT name, location 
                    FROM inventory 
                    GROUP BY name, location 
                    HAVING COUNT(*) > 1
                )
                ORDER BY name, location, created_at DESC
            `);

            console.log('\n--- Detailed Breakdown ---');
            console.table(details.rows);
        }
        process.exit(0);
    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
}

run();
