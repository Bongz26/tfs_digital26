const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data, error } = await supabase
        .from('stock_transfers')
        .select('*')
        .eq('transfer_number', 'TRF-2026-003')
        .single();

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Transfer Record:');
        console.log(JSON.stringify(data, null, 2));
    }
}

check();
