const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function inspectColumns() {
    console.log('--- Inspecting Existing Inventory Row ---');
    const { data, error } = await supabase.from('inventory').select('*').limit(1);

    if (error) {
        console.error('ERROR:', JSON.stringify(error, null, 2));
    } else if (data && data.length > 0) {
        console.log('COLUMNS FOUND:', Object.keys(data[0]));
        console.log('SAMPLE DATA:', JSON.stringify(data[0], null, 2));
    } else {
        console.log('No data found in inventory table.');
    }
}

inspectColumns();
