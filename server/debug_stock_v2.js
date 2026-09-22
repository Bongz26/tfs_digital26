const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugStock() {
    console.log('--- DEBUGGING STOCK DEDUCTION ---');

    // 1. Find the case
    const { data: caseData, error: caseErr } = await supabase
        .from('cases')
        .select('*')
        .or('deceased_name.ilike.%Nowewe%,case_number.ilike.%Nowewe%')
        .order('created_at', { ascending: false });

    if (caseErr) {
        console.error('Error fetching case:', caseErr);
        return;
    }

    if (!caseData || caseData.length === 0) {
        console.log('Case "Nowewe" not found.');
    } else {
        caseData.forEach(c => {
            console.log('Case Found:', {
                id: c.id,
                case_number: c.case_number,
                status: c.status,
                casket_type: c.casket_type,
                casket_colour: c.casket_colour,
                branch: c.branch,
                created_at: c.created_at
            });
        });
    }

    // 2. Find the inventory item
    const { data: invData, error: invErr } = await supabase
        .from('inventory')
        .select('*')
        .or('name.ilike.%Pongee%,model.ilike.%Pongee%');

    if (invErr) {
        console.error('Error fetching inventory:', invErr);
        return;
    }

    console.log('\nInventory items found:');
    invData.forEach(item => {
        console.log({
            id: item.id,
            name: item.name,
            model: item.model,
            color: item.color,
            location: item.location,
            stock_quantity: item.stock_quantity,
            reserved_quantity: item.reserved_quantity
        });
    });
}

debugStock();
