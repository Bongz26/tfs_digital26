const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function findCaseForItem63() {
    console.log('--- Reservations for ID 63 ---');
    const { data: res, error } = await supabase
        .from('reservations')
        .select('*, cases(*)')
        .eq('inventory_id', 63)
        .is('released_at', null);

    if (error) {
        console.error('Error:', error);
    } else {
        console.log(JSON.stringify(res, null, 2));
    }
}

findCaseForItem63();
