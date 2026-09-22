const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function listLocations() {
    const { data: items } = await supabase.from('inventory').select('location');
    const locations = [...new Set(items.map(i => i.location))];
    console.log('LOCATIONS:', JSON.stringify(locations));
}

listLocations();
