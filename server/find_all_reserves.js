const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function findAllReserves() {
    console.log('--- ALL Reserved Items in Database ---');
    const { data: items, error } = await supabase
        .from('inventory')
        .select('*')
        .gt('reserved_quantity', 0);

    if (error) {
        console.error('Error:', error);
    } else {
        console.log(JSON.stringify(items, null, 2));
    }
}

findAllReserves();
