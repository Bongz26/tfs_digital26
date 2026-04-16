const { getClient } = require('./server/config/db');
(async () => {
    const client = await getClient();
    const name = "4 TIER";
    const loc1 = "HEAD OFFICE";
    const loc2 = "Head Office";

    const { rows: r1 } = await client.query('SELECT id, name, location FROM inventory WHERE name ILIKE $1 AND location ILIKE $2', [name, loc1]);
    console.log("HEAD OFFICE match:", r1.length > 0 ? r1[0] : "None");

    const { rows: r2 } = await client.query('SELECT id, name, location FROM inventory WHERE name ILIKE $1 AND location ILIKE $2', [name, loc2]);
    console.log("Head Office match:", r2.length > 0 ? r2[0] : "None");

    client.release();
    process.exit(0);
})();
