const { query } = require('./config/db');

async function run() {
  try {
    const res = await query(`
      SELECT id, name, model, color, category, stock_quantity, reserved_quantity, location 
      FROM inventory 
      WHERE category = 'coffin' OR category IS NULL OR category = 'casket'
    `);
    const fs = require('fs');
    fs.writeFileSync('inventory_data_clean.json', JSON.stringify(res.rows, null, 2), 'utf8');
    console.log('Data written to inventory_data_clean.json');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
run();
