require('dotenv').config();
const { getSupabaseClient } = require('../utils/dbUtils');

async function debugExhaustive() {
    const supabase = getSupabaseClient();

    console.log('--- EXHAUSTIVE SEARCH DEBUG ---');

    // Test 1: Search by Name only
    console.log('\nTest 1: Search by Name "1/4 View" (Case-ins)...');
    const { data: nameMatches } = await supabase.from('inventory').select('id, name, location, category').ilike('name', '1/4 View');
    console.log(`Found ${nameMatches ? nameMatches.length : 0} items with Name "1/4 View".`);

    // Test 2: Search by Name and Location
    console.log('\nTest 2: Search by Name "1/4 View" AND Location "Head Office" (Case-ins)...');
    const { data: locMatches } = await supabase.from('inventory').select('id, name, location, category').ilike('name', '1/4 View').ilike('location', 'Head Office');
    console.log(`Found ${locMatches ? locMatches.length : 0} items at Head Office.`);
    if (locMatches) {
        locMatches.forEach(m => {
            console.log(`ID: ${m.id} | Name: [${m.name}] (len: ${m.name.length}) | Loc: [${m.location}] (len: ${m.location.length}) | Cat: [${m.category}]`);
        });
    }

    // Test 3: Search by ID 150 directly
    console.log('\nTest 3: Fetching ID 150 directly...');
    const { data: id150 } = await supabase.from('inventory').select('*').eq('id', 150);
    console.log('ID 150 data:', JSON.stringify(id150, null, 2));
}

debugExhaustive();
