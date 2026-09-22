// create_whatsapp_tables.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function createTables() {
  const client = await pool.connect();
  try {
    console.log('⏳ Creating WhatsApp tables...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS whatsapp_sessions (
          id SERIAL PRIMARY KEY,
          phone_number VARCHAR(50) UNIQUE NOT NULL,
          user_name VARCHAR(100),
          state VARCHAR(50) DEFAULT 'bot',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created whatsapp_sessions table');

    await client.query(`
      CREATE TABLE IF NOT EXISTS whatsapp_messages (
          id SERIAL PRIMARY KEY,
          session_id INTEGER REFERENCES whatsapp_sessions(id) ON DELETE CASCADE,
          sender VARCHAR(50) NOT NULL, 
          message_text TEXT NOT NULL,
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created whatsapp_messages table');

    // Trigger to update "updated_at" on whatsapp_sessions
    await client.query(`
      CREATE OR REPLACE FUNCTION update_modified_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = now();
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Only create trigger if it doesn't exist
    await client.query(`
      DROP TRIGGER IF EXISTS update_whatsapp_sessions_modtime ON whatsapp_sessions;
      CREATE TRIGGER update_whatsapp_sessions_modtime
      BEFORE UPDATE ON whatsapp_sessions
      FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
    `);
    console.log('✅ Created updated_at trigger for whatsapp_sessions');

  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
  } finally {
    client.release();
    pool.end();
  }
}

createTables();
