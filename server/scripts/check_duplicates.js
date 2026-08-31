const { Client } = require('pg');
const path = require('path');
const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const resolveIP = (hostname) => {
    return new Promise((resolve, reject) => {
        // Try IPv4 first via Cloudflare DoH
        const req = https.request(`https://cloudflare-dns.com/dns-query?name=${hostname}&type=A`, {
            headers: { 'Accept': 'application/dns-json' }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.Answer && json.Answer.length > 0) {
                        resolve(json.Answer.find(r => r.type === 1).data);
                    } else {
                        // Try IPv6
                        const req6 = https.request(`https://cloudflare-dns.com/dns-query?name=${hostname}&type=AAAA`, {
                            headers: { 'Accept': 'application/dns-json' }
                        }, (res6) => {
                            let data6 = '';
                            res6.on('data', chunk => data6 += chunk);
                            res6.on('end', () => {
                                try {
                                    const json6 = JSON.parse(data6);
                                    if (json6.Answer && json6.Answer.length > 0) {
                                        resolve(json6.Answer.find(r => r.type === 28).data);
                                    } else {
                                        reject(new Error('No A or AAAA records found via DoH'));
                                    }
                                } catch (e) { reject(e); }
                            });
                        });
                        req6.end();
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
            ssl: { rejectUnauthorized: false }
        });

        await client.connect();

        const res = await client.query(`
      SELECT id, name, model, stock_quantity 
      FROM inventory 
      WHERE name ILIKE '%ECONO%' 
      ORDER BY name, model
    `);

        console.table(res.rows);
        await client.end();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDuplicates();
