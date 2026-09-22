const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  try {
    await client.connect();
    console.log('Connecting to database...');
    
    const query = 'ALTER TABLE whatsapp_sessions ADD COLUMN IF NOT EXISTS funnel_data JSONB DEFAULT \'{}\';';
    await client.query(query);
    console.log('✅ Column "funnel_data" added successfully.');
    
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    await client.end();
  }
}

migrate();
