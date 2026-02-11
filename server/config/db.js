// server/config/db.js
const { Pool } = require('pg');
const path = require('path');
const dns = require('dns');
const util = require('util');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config();

// Check if DATABASE_URL is set
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ ERROR: DATABASE_URL environment variable is not set!');
  process.exit(1);
}

// Helper to resolve IP (prefers IPv4, falls back to IPv6)
const resolveIP = async (hostname) => {
  return new Promise((resolve, reject) => {
    dns.resolve4(hostname, (err, addresses) => {
      if (!err && addresses && addresses.length > 0) return resolve(addresses[0]);

      dns.resolve6(hostname, (err6, addresses6) => {
        if (!err6 && addresses6 && addresses6.length > 0) return resolve(addresses6[0]);
        reject(err || err6 || new Error('No IP address found'));
      });
    });
  });
};

const initPool = async () => {
  let connectionString = databaseUrl;

  try {
    const url = new URL(databaseUrl);
    console.log(`🔍 Resolving IP for ${url.hostname}...`);
    const ip = await resolveIP(url.hostname);
    console.log(`✅ Resolved ${url.hostname} to: ${ip}`);

    const fixedUrl = new URL(databaseUrl);
    // IPv6 must be in brackets for PG connection string
    fixedUrl.hostname = ip.includes(':') ? `[${ip}]` : ip;
    connectionString = fixedUrl.toString();
  } catch (e) {
    console.warn('⚠️ DNS resolution failed/skipped, using original URL:', e.message);
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 20
  });

  pool.on('connect', () => console.log('✅ Database connected successfully'));
  pool.on('error', (err) => console.error('❌ Database connection error:', err.message));

  return pool;
};

// Singleton pool promise
let poolPromise = null;

const getPool = () => {
  if (!poolPromise) {
    poolPromise = initPool();
  }
  return poolPromise;
};

const query = async (text, params) => {
  const pool = await getPool();
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (duration > 100 || !text.trim().toLowerCase().startsWith('select')) {
      console.log('Executed query', { text: text.substring(0, 50) + '...', duration, rows: res.rowCount });
    }
    return res;
  } catch (error) {
    console.error('Query error', { text, error: error.message });
    throw error;
  }
};

const getClient = async () => {
  const pool = await getPool();
  const client = await pool.connect();
  // ... monkey patch release ...
  const release = client.release.bind(client);
  client.release = () => release();
  return client;
};

module.exports = {
  query,
  getClient
  // Note: We don't export pool directly to force usage of async query/getClient
};
