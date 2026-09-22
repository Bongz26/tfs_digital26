const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function list2026() {
    const { data: cases, error } = await supabase
        .from('cases')
        .select('case_number, deceased_name, created_at')
        .ilike('case_number', 'THS-2026-%')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error:', error);
    } else if (cases && cases.length > 0) {
        console.log('--- 2026 CASES ---');
        cases.forEach(c => {
            console.log(`[${c.case_number}] -> ${c.deceased_name} (${c.created_at})`);
        });
    } else {
        console.log('NO 2026 CASES FOUND');
    }
}

list2026();
