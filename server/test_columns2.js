const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY);

async function check() {
    let query = supabase
        .from('inventory')
        .select('*')
        .limit(1);

    const { data: matches, error: fetchErr } = await query;
    if (fetchErr) console.error("Error:", fetchErr);
    else console.log("Columns:", Object.keys(matches[0]));
}
check();
