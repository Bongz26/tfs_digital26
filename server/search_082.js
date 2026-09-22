const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function search() {
    console.log('--- Searching for cases with 082 ---');
    const { data: cases } = await supabase.from('cases').select('case_number, deceased_name').ilike('case_number', '%082%');
    console.log(JSON.stringify(cases, null, 2));

    console.log('\n--- Searching for reservations with 082 in reference ---');
    const { data: res } = await supabase.from('reservations').select('*').ilike('confirmed_by', '%082%'); // Reference might be here
    console.log(JSON.stringify(res, null, 2));

    console.log('\n--- Searching for stock movements with 082 ---');
    const { data: move } = await supabase.from('stock_movements').select('*').ilike('reason', '%082%');
    console.log(JSON.stringify(move, null, 2));
}

search();
