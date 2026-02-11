const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function listAll082() {
    const { data: cases, error } = await supabase
        .from('cases')
        .select('case_number, deceased_name')
        .ilike('case_number', '%082%');

    if (error) {
        console.error('Error:', error);
    } else if (cases && cases.length > 0) {
        console.log('--- FOUND 082 CASES ---');
        cases.forEach(c => {
            console.log(`[${c.case_number}] -> ${c.deceased_name}`);
        });
    } else {
        console.log('NO 082 CASES FOUND');
    }
}

listAll082();
