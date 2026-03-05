require('dotenv').config();

console.log('--- ENV CHECK ---');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':***@') : 'MISSING');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL || 'MISSING');
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY ? 'FOUND (masked)' : 'MISSING');
console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? 'FOUND (masked)' : 'MISSING');

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY);

async function checkProject() {
    try {
        const { data, error } = await supabase.rpc('decrement_stock', {
            item_id: -1, // Dummy ID
            amount: 0,
            recorded_by_name: 'test',
            reason_text: 'test'
        });
        console.log('\nRPC Test Response:', JSON.stringify({ data, error }, null, 2));
    } catch (e) {
        console.error('\nRPC Test Error:', e.message);
    }
}

checkProject();
