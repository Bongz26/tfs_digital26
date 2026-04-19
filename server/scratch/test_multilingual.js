const { handleBotResponse } = require('../utils/whatsappBot');

// Mock Supabase
const supabase = {
    from: () => ({
        update: () => ({ eq: () => Promise.resolve({ data: {}, error: null }) })
    })
};

async function test() {
    console.log("--- TEST 1: Language Selection ---");
    const session1 = { id: 1, state: 'bot_language_selection', language: null };
    const resp1 = await handleBotResponse(supabase, session1, "2", { type: 'text' });
    console.log("Input: '2' (Sesotho)");
    console.log("Response:", resp1);
    if (resp1.includes("amohela")) console.log("✅ Success: Sesotho menu returned.");

    console.log("\n--- TEST 2: Main Menu in Zulu ---");
    const session2 = { id: 1, state: 'bot', language: 'isizulu' };
    const resp2 = await handleBotResponse(supabase, session2, "hi", { type: 'text' });
    console.log("Input: 'hi' (Zulu Profile)");
    console.log("Response:", resp2);
    if (resp2.includes("Singakusiza")) console.log("✅ Success: Zulu menu returned.");
    
    console.log("\n--- TEST 3: Agent Escalation in Sotho ---");
    const session3 = { id: 1, state: 'bot', language: 'sesotho' };
    const resp3 = await handleBotResponse(supabase, session3, "0", { type: 'text' });
    console.log("Input: '0' (Sotho Profile)");
    console.log("Response:", resp3);
    if (resp3.includes("moemeli")) console.log("✅ Success: Sotho escalation returned.");
}

test();
