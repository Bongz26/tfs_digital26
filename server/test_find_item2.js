const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY);

async function check() {
    const primaryName = "1/4 View";
    const selectedBranch = "HEAD OFFICE";
    const modelMatch = "CASKET";
    const colorStr = "KIAAT";

    let query = supabase
        .from('inventory')
        .select('*')
        .eq('category', 'coffin')
        .ilike('name', `%${primaryName}%`)
        .order('stock_quantity', { ascending: false });

    const { data: matches, error: fetchErr } = await query;
    console.log("Matches count:", matches ? matches.length : 0);
    
    if (matches && matches.length > 0) {
        console.log("First match name:", matches[0].name, "location:", matches[0].location);
        let candidates = matches.filter(i => (i.location || '').trim().toUpperCase() === selectedBranch);
        console.log("Candidates after location filter count:", candidates.length);
        
        if (modelMatch) {
            const exactModel = candidates.filter(i => i.model && i.model.toLowerCase() === modelMatch.toLowerCase());
            console.log("Exact model count:", exactModel.length);
            if (exactModel.length > 0) candidates = exactModel;
        }

        if (colorStr && candidates.length > 0) {
            const colorMatch = candidates.find(i => i.color && i.color.toLowerCase() === colorStr.toLowerCase());
            console.log("Color match found?", !!colorMatch, colorMatch ? colorMatch.color : '');
        }
    }
}

check();
