const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function checkAnyReplenishment() {
    console.log('--- Checking for ANY Replenishment in last 48 hours ---');

    const { data: movements, error } = await supabase
        .from('stock_movements')
        .select('*')
        .in('movement_type', ['replenishment', 'adjustment'])
        .gt('created_at', new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error:', error.message);
        return;
    }

    console.log(`Found ${movements.length} replenishment/adjustment records.`);
    movements.forEach(m => {
        console.log(`[${m.created_at}] Item: ${m.inventory_id} | Type: ${m.movement_type} | Change: ${m.quantity_change} | Reason: ${m.reason}`);
    });
}

checkAnyReplenishment();
