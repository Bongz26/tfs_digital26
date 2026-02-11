const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function testInsert() {
    console.log('--- Minimal Insert Test ---');
    const { data, error } = await supabase
        .from('inventory')
        .insert({ name: 'MINIMAL TEST ' + Date.now(), location: 'MAKENENG', category: 'coffin' })
        .select();

    if (error) {
        console.error('ERROR:', JSON.stringify(error, null, 2));
    } else {
        console.log('SUCCESS:', JSON.stringify(data, null, 2));
    }
}

testInsert();
