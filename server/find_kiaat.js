const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function findKiaatCases() {
    console.log('--- Cases with KIAAT caskets ---');
    const { data: cases } = await supabase
        .from('cases')
        .select('case_number, deceased_name, casket_type, branch, status')
        .ilike('casket_type', '%Kiaat%');

    console.log(JSON.stringify(cases, null, 2));

    console.log('\n--- Cases with THS-2026-082 exactly ---');
    const { data: case082 } = await supabase
        .from('cases')
        .select('*')
        .eq('case_number', 'THS-2026-082');
    console.log(JSON.stringify(case082, null, 2));
}

findKiaatCases();
