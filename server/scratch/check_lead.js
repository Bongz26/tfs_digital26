const { Client } = require('pg');
require('dotenv').config();

async function checkLatestLead() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    const res = await client.query("SELECT * FROM claim_drafts ORDER BY created_at DESC LIMIT 1");
    console.log(JSON.stringify(res.rows[0], null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

checkLatestLead();
