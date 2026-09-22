const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStatus() {
    try {
        console.log('--- Checking Manekeng/Makeneng Inventory ---');
        const { data: inventory, error: invError } = await supabase
            .from('inventory')
            .select('id, name, location, stock_quantity, reserved_quantity, notes')
            .or('location.ilike.%Manekeng%,location.ilike.%Makeneng%');

        if (invError) console.error('Inventory Error RAW:', JSON.stringify(invError));
        else console.log('Inventory RAW:', JSON.stringify(inventory));

        console.log('\n--- Checking Active Cases in Manekeng ---');
        const { data: cases, error: caseError } = await supabase
            .from('cases')
            .select('id, case_number, status, branch, casket_type, casket_colour')
            .or('branch.ilike.%Manekeng%,branch.ilike.%Makeneng%')
            .not('status', 'in', '("completed","cancelled","archived")'); // syntax might need adjustment for 'in', using simple neq for now or filter in JS

        // PostgREST syntax for NOT IN is .not('status', 'in', '(val1,val2)') but let's be safe with simple filter
        const { data: allBranchCases, error: branchError } = await supabase
            .from('cases')
            .select('id, case_number, status, branch, casket_type, casket_colour')
            .or('branch.ilike.%Manekeng%,branch.ilike.%Makeneng%');

        if (branchError) console.error('Case Error:', branchError);
        else {
            const active = allBranchCases.filter(c => !['completed', 'cancelled', 'archived'].includes(c.status));
            console.log('Active Cases:', JSON.stringify(active, null, 2));
        }

    } catch (err) {
        console.error('Script Error:', err);
    }
}

checkStatus();
