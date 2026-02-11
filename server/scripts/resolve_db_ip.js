const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
    console.error('No DATABASE_URL found');
    process.exit(1);
}

try {
    const url = new URL(dbUrl);
    const hostname = url.hostname;
    console.log(`🔍 Attempting to resolve ${hostname} using DoH...`);

    const resA = https.request(`https://cloudflare-dns.com/dns-query?name=${hostname}&type=A`, { headers: { 'Accept': 'application/dns-json' } }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            const response = JSON.parse(data);
            const aRecord = response.Answer?.find(r => r.type === 1);
            if (aRecord) {
                console.log(`✅ RESOLVED IPv4: ${aRecord.data}`);
                fs.writeFileSync(path.join(__dirname, 'resolved_ip.txt'), aRecord.data);
            } else {
                // Try AAAA
                const resAAAA = https.request(`https://cloudflare-dns.com/dns-query?name=${hostname}&type=AAAA`, { headers: { 'Accept': 'application/dns-json' } }, (res2) => {
                    let data2 = '';
                    res2.on('data', chunk => data2 += chunk);
                    res2.on('end', () => {
                        const response2 = JSON.parse(data2);
                        const aaaaRecord = response2.Answer?.find(r => r.type === 28);
                        if (aaaaRecord) {
                            console.log(`✅ RESOLVED IPv6: ${aaaaRecord.data}`);
                            fs.writeFileSync(path.join(__dirname, 'resolved_ip.txt'), aaaaRecord.data);
                        } else {
                            console.error('❌ No A or AAAA records found');
                        }
                    });
                });
                resAAAA.end();
            }
        });
    });
    resA.end();

} catch (e) {
    console.error('Invalid DATABASE_URL', e);
}
