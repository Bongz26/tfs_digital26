const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY);

async function check() {
    let query = supabase
        .from('inventory')
        .select('id, stock_quantity, reserved_quantity, name, model, color, unit_price, low_stock_threshold, sku, description, supplier, location')
        .eq('category', 'coffin')
        .ilike('name', `%1/4 View%`)
        .order('stock_quantity', { ascending: false });

    const { data: matches, error: fetchErr } = await query;
    console.log("Error:", fetchErr);
    console.log("Data:", matches ? matches.length : null);
}
check();
