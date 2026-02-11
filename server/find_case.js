const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function findCase() {
    const { data: cases, error } = await supabase
        .from('cases')
        .select('case_number, deceased_name')
        .eq('case_number', 'THS-2026-082');

    if (error) {
        console.error('Error:', error);
    } else if (cases && cases.length > 0) {
        console.log('RESULT:', JSON.stringify(cases[0]));
    } else {
        console.log('RESULT: NOT_FOUND');
    }
}

findCase();
