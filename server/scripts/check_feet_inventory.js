
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkInventory() {
    try {
        const { data, error } = await supabase
            .from('inventory')
            .select('*')
            .ilike('name', '%Feet%')
            .limit(10);

        if (error) {
            console.error('❌ Supabase Error:', error);
        } else {
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error('❌ Unexpected Error:', err);
    }
}

checkInventory();
