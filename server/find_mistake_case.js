const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function findMistakeCase() {
    console.log('--- Checking Reservations for item 14 ---');
    const { data: res } = await supabase
        .from('reservations')
        .select('*, inventory(name, location), cases(case_number, deceased_name)')
        .eq('inventory_id', 14);

    console.log(JSON.stringify(res, null, 2));
}

findMistakeCase();
