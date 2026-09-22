const { handleBotResponse } = require('../utils/whatsappBot');

// Mock Supabase
const supabase = {
    from: () => ({
        update: () => ({ eq: () => Promise.resolve({ data: {}, error: null }) }),
        insert: () => Promise.resolve({ data: {}, error: null })
    })
};

async function test() {
    console.log("--- TEST 1: Starting Quote Flow (Zulu) ---");
    const session1 = { id: 1, state: 'bot', language: 'isizulu', funnel_data: {} };
    const resp1 = await handleBotResponse(supabase, session1, "quote", { type: 'text' });
    console.log("Input: 'quote'");
    console.log("Response:", resp1);
    if (resp1.includes("ubani ofuna")) console.log("✅ Success: Zulu coverage question asked.");

    console.log("\n--- TEST 2: Budget Recommendation (English) ---");
    const session2 = { 
        id: 1, 
        state: 'bot_quote_budget', 
        language: 'english', 
        funnel_data: { category: 'family', age: 30 } 
    };
    const resp2 = await handleBotResponse(supabase, session2, "120", { type: 'text' });
    console.log("Input: '120' Budget");
    console.log("Response:", resp2);
    if (resp2.includes("Silver")) console.log("✅ Success: Recommended 'Silver' (R115) for budget R120.");

    console.log("\n--- TEST 3: Onboarding Completion (Sotho) ---");
    const session3 = { 
        id: 1, 
        state: 'bot_quote_onboarding_id', 
        language: 'sesotho',
        phone_number: '27658884516',
        funnel_data: { category: 'family', selectedPlan: 'Gold', selectedPrice: 152, fullName: 'John Doe' } 
    };
    const resp3 = await handleBotResponse(supabase, session3, "9001015000085", { type: 'text' });
    console.log("Input: ID Number");
    console.log("Response:", resp3);
    if (resp3.includes("amohela Thusanang")) console.log("✅ Success: Sotho success message and draft trigger.");
}

test();
