const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function clearItem63() {
    console.log('--- Clearing Leaked Reservation on Item 63 (Makeneng) ---');
    const { error } = await supabase
        .from('inventory')
        .update({ reserved_quantity: 0, updated_at: new Date() })
        .eq('id', 63);

    if (error) {
        console.error('Error clearing item 63:', error);
    } else {
        console.log('Successfully cleared Item 63.');
    }
}

clearItem63();
