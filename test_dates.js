const { getClient } = require('./server/config/db');
const fs = require('fs');
(async () => {
    const client = await getClient();
    const { rows } = await client.query('SELECT id, name, model, color, location, created_at, notes FROM inventory WHERE id IN (110, 255, 262) ORDER BY created_at ASC');
    fs.writeFileSync('output_dates.json', JSON.stringify(rows, null, 2));
    client.release();
    process.exit(0);
})();
