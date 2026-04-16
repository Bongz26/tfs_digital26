const handleBotResponse = async (supabase, session, messageText, messageObj) => {
    let responseText = "";
    const textBase = (messageText || "").trim().toLowerCase();
    const phoneNumber = session.phone_number;

    // Universal escalation or cancel (from any state)
    if (messageObj.type === 'text' && (textBase === '0' || textBase.includes('agent') || textBase === 'cancel')) {
        await supabase
            .from('whatsapp_sessions')
            .update({ state: 'agent' })
            .eq('id', session.id);
        
        return "I am connecting you to a live agent. Please hold on, they will respond shortly. Type 'end' if you wish to close this chat.";
    }

    // STATE: Claims Document Intake Flow
    if (session.state === 'bot_claims_intake') {
        if (messageObj.type === 'image' || messageObj.type === 'document') {
            return "Document received securely. Please upload the next document, or reply with 'done' when you have uploaded all of them.";
        } else if (textBase === 'done') {
            // User finished uploading documents
            await supabase
                .from('whatsapp_sessions')
                .update({ state: 'agent' })
                .eq('id', session.id);
            return "Thank you. Your claim documents have been received and passed to our claims department for processing.\n\nYou have been connected to a live agent for final verification. Please hold on.";
        } else {
            return "Please upload photos or PDFs of the required documents directly here in this chat.\n\nReply with 'done' when you are finished, or '0' to chat with an agent immediately.";
        }
    }

    // STATE: Default Main Menu (session.state === 'bot' or fallback)
    if (session.state === 'bot' || !session.state) {
        if (textBase === '1' || textBase.includes('application')) {
            responseText = "*New Application*\nPlease use our secure online portal to log an application: https://admintfs.onrender.com\n\nIf you require assistance from an agent while filling it out, please reply with *0*.";
        } 
        else if (textBase === '2' || textBase.includes('claim')) {
            // Transition to Claims Intake Flow
            await supabase
                .from('whatsapp_sessions')
                .update({ state: 'bot_claims_intake' })
                .eq('id', session.id);

            responseText = "To expedite your claim, please provide the following required documents:\n\n" +
                           "- Certified copy of the official death certificate\n" +
                           "- Certified copy of the claimant/beneficiary's ID (both sides)\n" +
                           "- Certified copy of the deceased's ID (both sides)\n" +
                           "- Completed BI/DHA-1663 form (all 3 pages)\n" +
                           "- Stamped bank statement of claimant (not older than 3 months)\n" +
                           "*(Include BI-1680 if they died at home, and police/medical reports for unnatural cases/stillborns)*\n\n" +
                           "Please upload photos or PDFs of these documents here. Reply with 'done' when you have uploaded all of them.";
        } 
        else if (textBase === '3' || textBase.includes('plan') || textBase.includes('price')) {
            responseText = "*Plans & Pricing*\nThusanang offers a variety of comprehensive funeral plans tailored to accommodate different family sizes and needs.\n\nPlease reply with *0* to connect with an agent for a personalized consultation and quotation.";
        } 
        else if (textBase === '4' || textBase.includes('pamphlet') || textBase.includes('brochure')) {
            responseText = "*Obtain Pamphlet*\nOur digital brochure will be available for download from this menu shortly. For immediate assistance and detailed information regarding our offerings, please reply with *0* to connect with an agent.";
        }
        else {
            // Fallback Menu
            responseText = `*Welcome to Thusanang Assistance!*\nHow can we assist you today? Please reply with a number to choose an option:\n\n1. New Application\n2. Claims Information\n3. Plans & Pricing\n4. Obtain Pamphlet\n\n0. Chat with an Agent\n\n_Powered by Thusanang_`;
        }
    }

    return responseText;
};

module.exports = {
    handleBotResponse
};
