const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  console.log('1. Checking/Creating DB Table...');
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS public.case_documents (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
        file_name TEXT NOT NULL,
        file_url TEXT NOT NULL,
        file_type TEXT,
        file_size BIGINT,
        uploaded_by TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    await pool.query(createTableQuery);
    console.log('✅ Table case_documents ensured.');
  } catch (err) {
    console.error('❌ Failed to create table:', err.message);
  } finally {
    await pool.end();
  }

  console.log('\n2. Checking/Creating Supabase Storage Bucket...');
  try {
    const { data: buckets, error: getErr } = await supabase.storage.listBuckets();
    if (getErr) throw getErr;

    const exists = buckets.find(b => b.name === 'case_documents');
    if (!exists) {
      console.log('Bucket "case_documents" missing, creating it...');
      const { data, error } = await supabase.storage.createBucket('case_documents', {
        public: true,
        allowedMimeTypes: null,
        fileSizeLimit: 10485760 // 10MB
      });
      if (error) throw error;
      console.log('✅ Bucket created successfully.');
    } else {
      console.log('✅ Bucket "case_documents" already exists.');
      if (!exists.public) {
          console.log('Warning: Bucket is not public. Attempting to update to public.');
          const { error } = await supabase.storage.updateBucket('case_documents', {
              public: true
          });
          if (error) console.error('Failed to make bucket public:', error);
          else console.log('✅ Bucket updated to be public.');
      }
    }
  } catch (err) {
    console.error('❌ Failed managing bucket:', err.message);
  }
}

run();
