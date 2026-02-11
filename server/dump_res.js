const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function dumpAll() {
    console.log('--- ITEMS WITH RESERVATIONS ---');
    const { data: inv } = await supabase.from('inventory').select('id, name, location, reserved_quantity').gt('reserved_quantity', 0);
    console.log(JSON.stringify(inv, null, 2));

    console.log('\n--- ACTIVE RESERVATIONS TABLE ---');
    const { data: res } = await supabase.from('reservations').select('*, inventory(name, location)').is('released_at', null);
    console.log(JSON.stringify(res, null, 2));
}

dumpAll();
