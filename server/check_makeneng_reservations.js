const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function checkMakenengReservations() {
    console.log('--- Searching for active reservations of Makeneng items ---');
    const { data: res, error } = await supabase
        .from('reservations')
        .select('*, inventory!inner(*), cases(*)')
        .ilike('inventory.location', '%Makeneng%')
        .is('released_at', null);

    if (error) {
        console.error('Error:', error);
    } else {
        console.log(JSON.stringify(res, null, 2));
    }
}

checkMakenengReservations();
