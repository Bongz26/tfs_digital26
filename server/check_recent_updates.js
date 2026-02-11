const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function checkRecentUpdates() {
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    console.log('--- Cases modified or created in last 48h ---');
    const { data: cases, error } = await supabase
        .from('cases')
        .select('id, case_number, deceased_name, created_at, updated_at, status')
        .or(`created_at.gte.${fortyEightHoursAgo},updated_at.gte.${fortyEightHoursAgo}`)
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('Error:', error);
    } else {
        console.log(JSON.stringify(cases, null, 2));
    }
}

checkRecentUpdates();
