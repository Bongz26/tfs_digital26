const { getClient } = require('./server/config/db');
const fs = require('fs');
(async () => {
    const client = await getClient();
    const res = await client.query("SELECT id, case_number, branch, casket_type, casket_colour FROM cases WHERE case_number IN ('THS-2026-087', 'THS-2026-090')");
    fs.writeFileSync('cases_out.json', JSON.stringify(res.rows, null, 2));
    client.release();
    process.exit(0);
})();
