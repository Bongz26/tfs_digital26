const { getClient } = require('./server/config/db');
(async () => {
    const client = await getClient();
    const { rows } = await client.query('SELECT id, name, category, location FROM inventory WHERE id = 110');
    console.log("ID 110 category:", rows[0] ? rows[0].category : "None");
    client.release();
    process.exit(0);
})();
