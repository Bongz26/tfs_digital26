const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function searchMovements() {
    console.log('--- Searching Stock Movements for 082 or Makeneng ---');
    const { data: move, error } = await supabase
        .from('stock_movements')
        .select('*, inventory(*)')
        .or('reason.ilike.%082%,reason.ilike.%Makeneng%')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error:', error);
    } else {
        console.log(JSON.stringify(move, null, 2));
    }
}

searchMovements();
