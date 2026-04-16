const { query } = require('./config/db');

async function run() {
  const res = await query(`
    SELECT conname, conrelid::regclass AS table_name 
    FROM pg_constraint 
    WHERE confrelid = 'inventory'::regclass
  `);
  console.log(res.rows);
  process.exit(0);
}
run();
