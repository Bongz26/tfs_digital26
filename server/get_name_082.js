const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function getName() {
    const { data: cases } = await supabase
        .from('cases')
        .select('case_number, deceased_name')
        .ilike('case_number', '%082%');

    if (cases && cases.length > 0) {
        console.log('NAME_FOUND:', cases[0].deceased_name);
        console.log('CASE_NUM_FOUND:', cases[0].case_number);
    } else {
        console.log('NOT_FOUND');
    }
}

getName();
