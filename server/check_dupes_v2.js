const { Pool } = require('pg');
const https = require('https');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    console.error('No DATABASE_URL found');
    process.exit(1);
}

function resolveIP(hostname) {
    return new Promise((resolve, reject) => {
        const req = https.request(`https://cloudflare-dns.com/dns-query?name=${hostname}&type=A`, {
            headers: { 'Accept': 'application/dns-json' }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    const aRecord = response.Answer?.find(r => r.type === 1);
                    if (aRecord) {
                        resolve(aRecord.data);
                    } else {
                        reject(new Error('No A record found'));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

async function run() {
    try {
        const url = new URL(dbUrl);
        console.log(`🔍 Resolving ${url.hostname}...`);
        const ip = await resolveIP(url.hostname);
        console.log(`✅ Resolved to: ${ip}`);

        const fixedUrl = new URL(dbUrl);
        fixedUrl.hostname = ip;

        const pool = new Pool({
            connectionString: fixedUrl.toString(),
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 10000
        });

        const client = await pool.connect();
        try {
            console.log('🔍 Checking for duplicate inventory items...');
            const res = await client.query(`
                SELECT name, location, COUNT(*) as count
                FROM inventory 
                GROUP BY name, location 
                HAVING COUNT(*) > 1
            `);

            console.log(`\nFound ${res.rows.length} duplicate groups.`);

            if (res.rows.length > 0) {
                console.table(res.rows);

                const details = await client.query(`
                    SELECT id, name, location, stock_quantity, created_at, category 
                    FROM inventory 
                    WHERE (name, location) IN (
                        SELECT name, location 
                        FROM inventory 
                        GROUP BY name, location 
                        HAVING COUNT(*) > 1
                    )
                    ORDER BY name, location, created_at DESC
                `);

                console.log('\n--- Detailed Breakdown ---');
                console.table(details.rows);
            }
        } finally {
            client.release();
            await pool.end();
        }

    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
}

run();
