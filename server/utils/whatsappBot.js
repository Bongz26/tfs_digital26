const handleBotResponse = async (supabase, phoneNumber, messageText) => {
    let responseText = "";
    const textBase = messageText.trim().toLowerCase();

    // Check for "agent" or "0" escalation
    if (textBase === '0' || textBase.includes('agent') || textBase.includes('help')) {
        // Change session state to 'agent'
        await supabase
            .from('whatsapp_sessions')
            .update({ state: 'agent' })
            .eq('phone_number', phoneNumber);
        
        return "I am connecting you to a live agent. Please hold on, they will read your previous messages and respond shortly. Type 'end' if you wish to close this chat.";
    } 
    
    // Check for "application" or "1"
    else if (textBase === '1' || textBase.includes('application')) {
        responseText = "📝 *New Application*\nIf you are an agent logging an application, you can do it securely here: https://admintfs.onrender.com \n\nIf you are a client looking for a plan, reply with *3*.";
    } 
    
    // Check for "claim" or "2"
    else if (textBase === '2' || textBase.includes('claim')) {
        responseText = "🛡️ *Claims*\nTo process a claim, we require the following documents:\n1. BI-1663 Form\n2. Copy of ID of deceased\n3. Copy of ID of claimant\n\nYou can reply with photos of these documents to store them, or ask for an agent by replying *0*.";
    } 
    
    // Check for "plan" or "price" or "3"
    else if (textBase === '3' || textBase.includes('plan') || textBase.includes('price')) {
        responseText = "📜 *Plans & Pricing*\nWe offer various comprehensive funeral plans suited for different family sizes.\n\nReply *0* to speak to an agent who can give you a personalized quote!";
    } 
    
    // Check for "pamphlet" or "brochure" or "4"
    else if (textBase === '4' || textBase.includes('pamphlet') || textBase.includes('brochure')) {
        responseText = "📖 *Pamphlet*\nOur digital brochure will be available to download here soon. For immediate info, reply *0* to chat with our staff.";
    }

    // Default Main Menu
    else {
        responseText = `*Welcome to TFS Digital Assistance!*\nWe are here to help. Reply with a number to choose an option:\n\n1️⃣ 📝 New Application\n2️⃣ 🛡️ Claims Information\n3️⃣ 📜 Plans & Pricing\n4️⃣ 📖 Obtain Pamphlet\n0️⃣ 👨‍💻 Chat with an Agent\n\n_Powered by TFS Digital_`;
    }

    return responseText;
};

module.exports = {
    handleBotResponse
};
