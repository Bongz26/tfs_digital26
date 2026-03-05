require('dotenv').config();

function decodeJwt(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = parts[1];
        const decoded = Buffer.from(payload, 'base64').toString();
        return JSON.parse(decoded);
    } catch (e) {
        return null;
    }
}

console.log('--- JWT DECODE CHECK ---');
const anon = decodeJwt(process.env.SUPABASE_KEY);
const service = decodeJwt(process.env.SUPABASE_SERVICE_KEY);

console.log('Anon Key Ref:', anon ? anon.ref : 'NULL');
console.log('Service Key Ref:', service ? service.ref : 'NULL');
console.log('Expected Ref: uucjdcbtpunfsyuixsmc');
