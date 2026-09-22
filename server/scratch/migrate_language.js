const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  try {
    await client.connect();
    console.log('Connecting to database...');
    
    const query = 'ALTER TABLE whatsapp_sessions ADD COLUMN IF NOT EXISTS language TEXT DEFAULT \'english\';';
    await client.query(query);
    console.log('✅ Column "language" added successfully (or already exists).');
    
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    await client.end();
  }
}

migrate();
