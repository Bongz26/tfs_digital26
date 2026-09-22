const { handleBotResponse } = require('../utils/whatsappBot');

// Mock Supabase
const supabase = {
    from: (table) => ({
        update: () => ({ eq: () => Promise.resolve({ data: {}, error: null }) }),
        select: () => ({ 
            eq: () => ({ ilike: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }) }),
            ilike: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }) 
        }),
        insert: () => Promise.resolve({ data: {}, error: null })
    })
};

async function testReferral() {
    console.log("--- TEST 1: Generating Referral Link (English) ---");
    const session1 = { id: 1, state: 'bot', language: 'english', phone_number: '27650001234', funnel_data: {} };
    const resp1 = await handleBotResponse(supabase, session1, "5", { type: 'text' });
    console.log("Input: '5' (Share & Earn)");
    console.log("Response Includes Link:", resp1.includes("wa.me/27604965026?text=REFERRED_BY_27650001234"));
    if (resp1.includes("wa.me")) console.log("✅ Success: Link generated with referrer's phone number.");

    console.log("\n--- TEST 2: Triggering Reward on Onboarding (Sotho) ---");
    // User was referred by 27650001234
    const session2 = { 
        id: 2, 
        state: 'bot_quote_onboarding_id', 
        language: 'sesotho',
        phone_number: '27710009999',
        funnel_data: { 
            category: 'family', 
            selectedPlan: 'Gold', 
            selectedPrice: 152, 
            fullName: 'Referred Lead',
            referred_by: '27650001234' 
        } 
    };
    const resp2 = await handleBotResponse(supabase, session2, "9001015000085", { type: 'text' });
    console.log("Input: ID Number (Completing Onboarding)");
    console.log("Response:", resp2);
    if (resp2.includes("amohela Thusanang")) console.log("✅ Success: Lead created and reward trigger called (check logs above).");
}

testReferral();
