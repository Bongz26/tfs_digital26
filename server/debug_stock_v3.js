const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugStock() {
    const results = {
        timestamp: new Date().toISOString(),
        cases: [],
        inventory: []
    };

    // 1. Find the case
    const { data: caseData, error: caseErr } = await supabase
        .from('cases')
        .select('*')
        .or('deceased_name.ilike.%Nowewe%,case_number.ilike.%Nowewe%')
        .order('created_at', { ascending: false });

    if (!caseErr && caseData) {
        results.cases = caseData.map(c => ({
            id: c.id,
            case_number: c.case_number,
            deceased_name: c.deceased_name,
            status: c.status,
            casket_type: c.casket_type,
            casket_colour: c.casket_colour,
            branch: c.branch,
            created_at: c.created_at
        }));
    }

    // 2. Find the inventory item
    const { data: invData, error: invErr } = await supabase
        .from('inventory')
        .select('*')
        .or('name.ilike.%Pongee%,model.ilike.%Pongee%');

    if (!invErr && invData) {
        results.inventory = invData.map(item => ({
            id: item.id,
            name: item.name,
            model: item.model,
            color: item.color,
            location: item.location,
            stock_quantity: item.stock_quantity,
            reserved_quantity: item.reserved_quantity
        }));
    }

    fs.writeFileSync('debug_results.json', JSON.stringify(results, null, 2));
    console.log('Results written to debug_results.json');
}

debugStock();
