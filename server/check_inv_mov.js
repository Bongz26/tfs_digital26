const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function checkInventoryMovements() {
    console.log('--- Checking inventory_movements ---');

    // Items found earlier: 35, 153, 191
    const itemIds = [35, 153, 191];

    const { data: movements, error } = await supabase
        .from('inventory_movements')
        .select('*')
        .in('inventory_id', itemIds)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching inventory_movements:', error.message);
        if (error.code === 'PGRST116' || error.message.includes('not found')) {
            console.log('Table inventory_movements might not exist.');
        }
        return;
    }

    console.log(`Found ${movements.length} records in inventory_movements:`);
    movements.forEach(m => {
        console.log(`[${m.created_at}] Item: ${m.inventory_id} | Type: ${m.movement_type} | Change: ${m.quantity_change} | New: ${m.new_quantity} | Reason: ${m.reason}`);
    });
}

checkInventoryMovements();
