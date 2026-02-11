const { query } = require('./server/config/db');

async function checkDuplicates() {
    try {
        const res = await query(`
      SELECT name, location, COUNT(*) 
      FROM inventory 
      GROUP BY name, location 
      HAVING COUNT(*) > 1
    `);

        console.log('Duplicate Items Found:', res.rows.length);
        if (res.rows.length > 0) {
            console.table(res.rows);

            // Get details of the duplicates
            const dupeDetails = await query(`
        SELECT id, name, location, stock_quantity, created_at 
        FROM inventory 
        WHERE (name, location) IN (
          SELECT name, location 
          FROM inventory 
          GROUP BY name, location 
          HAVING COUNT(*) > 1
        )
        ORDER BY name, location, created_at
      `);
            console.log('\n--- Detailed Duplicate Entries ---');
            console.table(dupeDetails.rows);
        } else {
            console.log('No duplicates found based on Name + Location.');
        }
        process.exit(0);
    } catch (err) {
        console.error('Error checking duplicates:', err);
        process.exit(1);
    }
}

checkDuplicates();
