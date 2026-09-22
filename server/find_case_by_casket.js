const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function findCaseByCasket() {
    console.log('--- Searching Cases for 1.9 Feet ---');
    const { data: cases1 } = await supabase
        .from('cases')
        .select('case_number, deceased_name, casket_type, branch, status, created_at')
        .or('casket_type.ilike.%1.9 Feet%,casket_type.ilike.%Kiaat%')
        .order('created_at', { ascending: false });

    console.log(JSON.stringify(cases1, null, 2));

    console.log('\n--- Searching for reservations mentioning Makeneng or Kiaat ---');
    const { data: res } = await supabase
        .from('reservations')
        .select('*, cases(case_number, deceased_name), inventory(*)')
        .is('released_at', null);

    const filtered = res.filter(r =>
        (r.inventory && (r.inventory.location === 'MAKENENG' || r.inventory.color === 'KIAAT'))
    );
    console.log(JSON.stringify(filtered, null, 2));
}

findCaseByCasket();
