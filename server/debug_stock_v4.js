const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugStockExtended() {
    const results = {
        timestamp: new Date().toISOString(),
        case: null,
        inventory_matches: [],
        all_inventory_count: 0
    };

    // 1. Fetch the specific case with all columns
    const { data: caseData, error: caseErr } = await supabase
        .from('cases')
        .select('*')
        .ilike('deceased_name', '%Nowewe%')
        .single();

    if (caseErr) {
        console.error('Error fetching case:', caseErr);
        results.error = caseErr;
    } else {
        results.case = caseData;
    }

    if (caseData) {
        const nameStr = String(caseData.casket_type || '').trim();
        let primaryName = nameStr;
        let modelMatch = null;
        if (nameStr.includes(' - ')) {
            const parts = nameStr.split(' - ');
            primaryName = parts[0].trim();
            modelMatch = parts[1].trim();
        }

        console.log(`Debug Mapping: nameStr="${nameStr}" -> primaryName="${primaryName}", modelMatch="${modelMatch}"`);

        // 2. Perform the exact query the backend does
        let query = supabase
            .from('inventory')
            .select('*')
            .eq('category', 'coffin')
            .ilike('name', primaryName);

        if (modelMatch) {
            query = query.ilike('model', modelMatch);
        }

        const { data: matches, error: matchErr } = await query;
        results.inventory_matches = matches || [];
        results.match_query = { primaryName, modelMatch };
    }

    fs.writeFileSync('debug_extended.json', JSON.stringify(results, null, 2));
    console.log('Results written to debug_extended.json');
}

debugStockExtended();
