const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function listBranches() {
    const { data: cases, error } = await supabase
        .from('cases')
        .select('branch');

    if (error) {
        console.error('Error:', error);
    } else {
        const branches = [...new Set(cases.map(c => c.branch))];
        console.log('Branches found:', branches);
    }
}

listBranches();
