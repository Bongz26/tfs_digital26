require('dotenv').config();
const { getSupabaseClient } = require('../utils/dbUtils');
const { findOrCreateInventoryItem } = require('../utils/inventoryHelpers');

async function debugSearch() {
    const supabase = getSupabaseClient();

    // Case THS-2026-073 details
    const params = {
        name: '1/4 View - CASKET',
        color: 'KIAAT',
        branch: 'Head Office',
        category: 'coffin',
        caseNumber: 'THS-2026-073'
    };

    console.log('--- DEBUGGING findOrCreateInventoryItem ---');
    console.log('Params:', params);

    // Manual reconstruction of search
    const primaryName = '1/4 View';
    const modelMatch = 'CASKET';
    const selectedBranch = 'HEAD OFFICE';

    console.log('\nRunning raw search query...');
    let query = supabase
        .from('inventory')
        .select('*')
        .eq('category', 'coffin')
        .ilike('location', selectedBranch)
        .ilike('name', primaryName);

    const { data, error } = await query;
    if (error) {
        console.error('Search error:', error);
    } else {
        console.log(`Found ${data.length} potential matches.`);
        data.forEach(item => {
            console.log(`ID: ${item.id} | Name: "${item.name}" | Model: "${item.model}" | Color: "${item.color}" | Loc: "${item.location}"`);

            if (item.id === 150) {
                console.log('   -> Checking ID 150 specifically:');
                console.log(`      model check: "${item.model}" === "${modelMatch}"? ${item.model === modelMatch}`);
                console.log(`      color check: "${item.color}" === "${params.color}"? ${item.color === params.color}`);
            }
        });
    }
}

debugSearch();
