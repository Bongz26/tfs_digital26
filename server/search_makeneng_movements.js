const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function searchMakenengMovements() {
    console.log('--- Stock Movements for ANY Makeneng Item ---');
    // Fetch all Makeneng items first
    const { data: items } = await supabase.from('inventory').select('id, name, model, color').ilike('location', '%Makeneng%');
    const ids = items.map(i => i.id);

    const { data: move, error } = await supabase
        .from('stock_movements')
        .select('*, inventory(name, location, model, color)')
        .in('inventory_id', ids)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error:', error);
    } else {
        console.log(JSON.stringify(move, null, 2));
    }
}

searchMakenengMovements();
