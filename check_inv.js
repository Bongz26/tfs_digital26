const { getClient } = require('./server/config/db');
const fs = require('fs');
(async () => {
    const client = await getClient();
    const { rows } = await client.query('SELECT id, name, model, color, location FROM inventory WHERE name ILIKE \'%4 TIER%\'');
    fs.writeFileSync('output.json', JSON.stringify(rows, null, 2));
    client.release();
    process.exit(0);
})();
