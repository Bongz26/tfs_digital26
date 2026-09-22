const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function getData() {
    const { data: cases, error } = await supabase
        .from('cases')
        .select('*')
        .ilike('case_number', '%082%');

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('CASE 082 DATA:');
        console.log(JSON.stringify(cases, null, 2));
    }
}

getData();
