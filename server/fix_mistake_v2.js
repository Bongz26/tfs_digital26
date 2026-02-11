const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function fixMistake() {
    const itemId = 39;
    const { data: item } = await supabase.from('inventory').select('reserved_quantity').eq('id', itemId).single();

    if (item && item.reserved_quantity > 0) {
        console.log(`Decreasing reserved_quantity for item ${itemId} from ${item.reserved_quantity} to ${item.reserved_quantity - 1}`);
        const { error } = await supabase
            .from('inventory')
            .update({ reserved_quantity: item.reserved_quantity - 1, updated_at: new Date() })
            .eq('id', itemId);

        if (error) {
            console.error('Update failed:', error);
        } else {
            console.log('Update successful');
        }
    } else {
        console.log('No reserved quantity to release or item not found.');
    }
}

fixMistake();
