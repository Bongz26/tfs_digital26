const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function listRecent() {
    const { data: cases, error } = await supabase
        .from('cases')
        .select('id, case_number, deceased_name, created_at, status')
        .order('created_at', { ascending: false })
        .limit(100);

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('RECENT CASES:');
        cases.forEach(c => {
            console.log(`[${c.id}] ${c.case_number} -> ${c.deceased_name} (${c.created_at})`);
        });
    }
}

listRecent();
