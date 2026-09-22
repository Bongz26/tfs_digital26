const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugMovements() {
    const results = {
        timestamp: new Date().toISOString(),
        case: null,
        movements: [],
        auto_created_items: []
    };

    // 1. Fetch the case
    const { data: caseData } = await supabase
        .from('cases')
        .select('*')
        .ilike('deceased_name', '%Nowewe%')
        .single();
    results.case = caseData;

    if (caseData) {
        // 2. Fetch movements for this case
        const { data: movements } = await supabase
            .from('inventory_movements')
            .select('*')
            .eq('case_id', caseData.id);
        results.movements = movements || [];

        // Also try by case number in reason just in case
        const { data: movementsByNum } = await supabase
            .from('inventory_movements')
            .select('*')
            .ilike('reason', `%${caseData.case_number}%`);
        results.movements_by_number = movementsByNum || [];
    }

    // 3. Fetch auto-created items
    const { data: autoItems } = await supabase
        .from('inventory')
        .select('*')
        .or('notes.ilike.%auto-created%,description.ilike.%auto-created%');
    results.auto_created_items = autoItems || [];

    fs.writeFileSync('debug_movements.json', JSON.stringify(results, null, 2));
    console.log('Results written to debug_movements.json');
}

debugMovements();
