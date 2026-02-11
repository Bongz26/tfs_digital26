const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function listMakeneng() {
    console.log('--- All Items in Makeneng ---');
    const { data: items, error } = await supabase
        .from('inventory')
        .select('*')
        .ilike('location', '%Makeneng%');

    if (error) {
        console.error('Error:', error);
    } else {
        console.log(JSON.stringify(items, null, 2));
    }
}

listMakeneng();
