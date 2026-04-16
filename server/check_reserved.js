const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY);

async function check() {
    console.log("--- INVENTORY ITEMS ---");
    const { data: inv, error: e1 } = await supabase
        .from('inventory')
        .select('*')
        .ilike('name', '%1.9%')
        .ilike('location', '%makeneng%');
    console.log(inv);

    console.log("\n--- CASES USING 1.9 FEET ---");
    const { data: cases, error: e2 } = await supabase
        .from('cases')
        .select('id, case_number, status, casket_type, casket_colour, branch')
        .ilike('casket_type', '%1.9%')
        .ilike('branch', '%makeneng%');
    console.log(cases);

    console.log("\n--- GHOST STOCK ---");
    const { data: ghost, error: e3 } = await supabase
        .from('inventory')
        .select('*')
        .ilike('name', '%1.9%')
        .ilike('sku', 'AUTO-%');
    console.log(ghost);
}
check();
