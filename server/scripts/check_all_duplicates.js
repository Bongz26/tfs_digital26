const { Client } = require('pg');
const path = require('path');
const https = require('https');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const resolveIP = (hostname) => {
    return new Promise((resolve, reject) => {
        // Try IPv4 first via Cloudflare DoH - FORCE IPv4 ONLY
        const req = https.request(`https://cloudflare-dns.com/dns-query?name=${hostname}&type=A`, {
            headers: { 'Accept': 'application/dns-json' }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log('DNS Response:', data); // Debug logging
                try {
                    const json = JSON.parse(data);
                    if (json.Answer && json.Answer.length > 0) {
                        const rec = json.Answer.find(r => r.type === 1);
                        if (rec) {
                            resolve(rec.data);
                        } else {
                            // Fallback to first record if strict A check fails but answers exist (unlikely)
                            resolve(json.Answer[0].data);
                        }
                    } else {
                        reject(new Error('No A record found (IPv4 only enforced)'));
                    }
                } catch (e) { reject(e); }
            });
        });
        req.on('error', reject);
        req.end();
    });
};

async function checkDuplicates() {
    try {
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) throw new Error('DATABASE_URL not set');

        const url = new URL(dbUrl);
        console.log(`Resolving ${url.hostname}...`);
        const ip = await resolveIP(url.hostname);
        console.log(`Resolved to ${ip}`);

        const fixedUrl = new URL(dbUrl);
        fixedUrl.hostname = ip.includes(':') ? `[${ip}]` : ip;

        const client = new Client({
            connectionString: fixedUrl.toString(),
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 20000 // Increased timeout
        });

        await client.connect();

        console.log('--- Checking for Duplicate Name + Location ---');

        const res = await client.query(`
            SELECT name, location, COUNT(*) as count
            FROM inventory 
            GROUP BY name, location 
            HAVING COUNT(*) > 1
        `);

        if (res.rows.length > 0) {
            console.log(`Found ${res.rows.length} groups of duplicates.`);
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
            console.log('\n--- Details ---');
            console.table(details.rows);
        } else {
            console.log('No duplicates found.');
        }

        await client.end();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDuplicates();
