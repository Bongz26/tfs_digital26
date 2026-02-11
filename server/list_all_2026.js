const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function listAll2026() {
    const { data: cases, error } = await supabase
        .from('cases')
        .select('case_number, deceased_name, casket_type, branch, status, created_at')
        .ilike('case_number', 'THS-2026-%')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('--- ALL 2026 CASES ---');
        console.log(JSON.stringify(cases, null, 2));
    }
}

listAll2026();
