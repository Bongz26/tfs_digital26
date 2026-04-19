const TRANSLATIONS = {
    english: {
        welcome: "*Welcome to Thusanang Assistance!*",
        langSelect: "Please choose your preferred language:\n1. English\n2. Sesotho\n3. IsiZulu",
        menuPrompt: "How can we assist you today? Please reply with a number to choose an option:",
        opt1: "1. New Application",
        opt2: "2. Claims Information",
        opt3: "3. Plans & Pricing",
        opt4: "4. Obtain Pamphlet",
        opt0: "0. Chat with an Agent",
        agentConnecting: "I am connecting you to a live agent. Please hold on, they will respond shortly. Type 'end' if you wish to close this chat.",
        appInfo: "*New Application*\nPlease use our secure online portal to log an application: https://admintfs.onrender.com\n\nIf you require assistance from an agent while filling it out, please reply with *0*.",
        claimsInfo: "To expedite your claim, please provide the following required documents:\n\n" +
                    "- Certified copy of the official death certificate\n" +
                    "- Certified copy of the claimant/beneficiary's ID (both sides)\n" +
                    "- Certified copy of the deceased's ID (both sides)\n" +
                    "- Completed BI/DHA-1663 form (all 3 pages)\n" +
                    "- Stamped bank statement of claimant (not older than 3 months)\n" +
                    "*(Include BI-1680 if they died at home, and police/medical reports for unnatural cases/stillborns)*\n\n" +
                    "Please upload photos or PDFs of these documents here. Reply with 'done' when you have uploaded all of them.",
        plansInfo: "*Plans & Pricing*\nThusanang offers a variety of comprehensive funeral plans tailored to accommodate different family sizes and needs.\n\nPlease reply with *0* to connect with an agent for a personalized consultation and quotation.",
        pamphletInfo: "*Obtain Pamphlet*\nOur digital brochure will be available for download from this menu shortly. For immediate assistance and detailed information regarding our offerings, please reply with *0* to connect with an agent.",
        docReceived: "Document received securely. Please upload the next document, or reply with 'done' when you have uploaded all of them.",
        claimsFinished: "Thank you. Your claim documents have been received and passed to our claims department for processing.\n\nYou have been connected to a live agent for final verification. Please hold on.",
        claimsInstructions: "Please upload photos or PDFs of the required documents directly here in this chat.\n\nReply with 'done' when you are finished, or '0' to chat with an agent immediately.",
        invalidSelection: "Invalid selection. Please choose a valid number from the menu."
    },
    sesotho: {
        welcome: "*Re u amohela ho Thusanang Assistance!*",
        langSelect: "Ka kopo khetha puo ea hau:\n1. English\n2. Sesotho\n3. IsiZulu",
        menuPrompt: "Re ka u thusa joang kajeno? Ka kopo araba ka nomoro ho khetha:",
        opt1: "1. Kopo e Ncha",
        opt2: "2. Litaba tsa Likleime",
        opt3: "3. Merero le Litheko",
        opt4: "4. Fumana Pampiri",
        opt0: "0. Bua le Moemeli",
        agentConnecting: "Ke u hokahanya le moemeli wa rona. Ka kopo emanyana, o tla u araba haufinyane. Ngola 'end' haeba u batla ho koala moqoqo ona.",
        appInfo: "*Kopo e Ncha*\nka kopo sebelisa portal ea rona e sireletsehileng ho kenya kopo: https://admintfs.onrender.com\n\nHaeba u hloka thuso ho moemeli ha u ntse u e tlatsa, ka kopo araba ka *0*.",
        claimsInfo: "Ho potlakisa tleime ea hau, ka kopo fana ka litokomane tse latelang tse hlokahalang:\n\n" +
                    "- Khopi e netefalitsoeng ea setifikeiti sa semmuso sa lefu\n" +
                    "- Khopi e netefalitsoeng ea ID ea mojalefa (mahlale a mabeli)\n" +
                    "- Khopi e netefalitsoeng ea ID ea mofu (mahlale a mabeli)\n" +
                    "- Foromo e tlatsweng ea BI/DHA-1663 (maqephe ohle a 3)\n" +
                    "- Setatemente sa banka se setempetsoeng sa mojalefa (se sa feteng likhoeli tse 3)\n\n" +
                    "Ka kopo kenya linepe kapa li-PDF tsa litokomane tsena mona. Araba ka 'done' ha u qetile ho li kenya kaofela.",
        plansInfo: "*Merero le Litheko*\nThusanang e fana ka merero e fapaneng ea lepato e lokiselitsoeng ho amohela boholo ba malapa a fapaneng le litlhoko.\n\nKa kopo araba ka *0* ho hokahana le moemeli bakeng sa thulaganyo le qotulo ea hau.",
        pamphletInfo: "*Fumana Pampiri*\nBukana ea rona ea dijithale e tla fumaneha bakeng sa ho khoasolloa mona haufinyane. Bakeng sa thuso ea hang-hang, ka kopo araba ka *0* ho hokahana le moemeli.",
        docReceived: "Tokomane e amohetsoe ka mokhoa o sireletsehileng. Ka kopo kenya tokomane e latelang, kapa u arabe ka 'done' ha u qetile.",
        claimsFinished: "Kea leboha. Litokomane tsa hau tsa tleime li amohetsoe mme li fetiselitsoe lefapheng la rona la likleime.\n\nU hokahantsoe le moemeli bakeng sa netefatso ea ho qetela. Ka kopo emanyana.",
        claimsInstructions: "Ka kopo kenya linepe kapa li-PDF tsa litokomane mona hle.\n\nAraba ka 'done' ha u qetile, kapa '0' ho bua le moemeli hang-hang.",
        invalidSelection: "Khetho ha e ea nepahala. Ka kopo khetha nomoro e nepahetseng lenaneong."
    },
    isizulu: {
        welcome: "*Siyakwamukela ku-Thusanang Assistance!*",
        langSelect: "Sicela ukhethe ulimi lwakho:\n1. English\n2. Sesotho\n3. IsiZulu",
        menuPrompt: "Singakusiza kanjani namuhla? Sicela uphendule ngenombolo ukuze ukhethe:",
        opt1: "1. Isicelo Esisha",
        opt2: "2. Imininingwane Yezicelo",
        opt3: "3. Izinhlelo Nezintengo",
        opt4: "4. Thola iBhrusha",
        opt0: "0. Khuluma no-Agent",
        agentConnecting: "Ngikuxhumanisa no-agent wethu. Sicela ulinde kancane, uzokuphendula maduze. Bhala 'end' uma ufuna ukuvala le ngxoxo.",
        appInfo: "*Isicelo Esisha*\nSicela usebenzise ingosi yethu evikelekile ukufaka isicelo: https://admintfs.onrender.com\n\nUma udinga usizo ku-agent ngenkathi usigcwalisa, sicela uphendule ngo-*0*.",
        claimsInfo: "Ukuze usheshise isimangalo sakho, sicela unikeze le mibhalo elandelayo edingekayo:\n\n" +
                    "- Ikhophia eqinisekisiwe yesitifiketi sokushona esisemthethweni\n" +
                    "- Ikhophia eqinisekisiwe kamazisi (ID) womhlomuli (nxazonke)\n" +
                    "- Ikhophia eqinisekisiwe kamazisi (ID) kamufi (nxazonke)\n" +
                    "- Ifomu eligcwalisiwe le-BI/DHA-1663 (wonke amakhasi ama-3)\n" +
                    "- Isitatimende sasebhange esinezitembu somhlomuli (esingeqile ezinyangeni ezi-3)\n\n" +
                    "Sicela ufake izithombe noma ama-PDF ale mibhalo lapha. Phendula ngokuthi 'done' uma usuqedile ukuyifaka yonke.",
        plansInfo: "*Izinhlelo Nezintengo*\nI-Thusanang ihlinzeka ngezinhlelo zomngcwabo ezahlukene eziklanyelwe ukuhlinzeka imindeni yabo bonke osayizi nezidingo.\n\nSicela uphendule ngo-*0* ukuze uxhumane no-agent ukuze uthole imininingwane nentengo yakho.",
        pamphletInfo: "*Thola iBhrusha*\nIbhuloshu yethu yedijithali izotholakala lapha maduze. Ukuze uthole usizo olusheshayo nemininingwane, sicela uphendule ngo-*0* ukuze uxhumane no-agent.",
        docReceived: "Umbhalo ufunyenwe ngokuphepha. Sicela ufake umbhalo olandelayo, noma uphendule ngokuthi 'done' uma usuqedile.",
        claimsFinished: "Siyabonga. Imibhalo yakho yesimangalo ifunyenwe futhi idluliselwe emnyangweni wethu wezicelo.\n\nUxhunyiwe no-agent ukuze kuqinisekiswe okokugcina. Sicela ulinde.",
        claimsInstructions: "Sicela ufake izithombe noma ama-PDF emibhalo edingekayo lapha.\n\nPhendula ngokuthi 'done' uma usuqedile, noma '0' ukuze ukhulume no-agent manje.",
        invalidSelection: "Ukukhetha akulungile. Sicela ukhethe inombolo elungile kumenyu."
    }
};

const handleBotResponse = async (supabase, session, messageText, messageObj) => {
    let responseText = "";
    const textBase = (messageText || "").trim().toLowerCase();
    const lang = session.language || 'english';
    const t = TRANSLATIONS[lang] || TRANSLATIONS.english;

    // Universal escalation or cancel (from any state)
    if (messageObj.type === 'text' && (textBase === '0' || textBase.includes('agent') || textBase === 'cancel')) {
        await supabase
            .from('whatsapp_sessions')
            .update({ state: 'agent' })
            .eq('id', session.id);
        
        return t.agentConnecting;
    }

    // STATE: Language Selection
    if (session.state === 'bot_language_selection') {
        if (textBase === '1') {
            await supabase.from('whatsapp_sessions').update({ language: 'english', state: 'bot' }).eq('id', session.id);
            const nt = TRANSLATIONS.english;
            return `${nt.welcome}\n\n${nt.menuPrompt}\n\n${nt.opt1}\n${nt.opt2}\n${nt.opt3}\n${nt.opt4}\n\n${nt.opt0}`;
        } else if (textBase === '2') {
            await supabase.from('whatsapp_sessions').update({ language: 'sesotho', state: 'bot' }).eq('id', session.id);
            const nt = TRANSLATIONS.sesotho;
            return `${nt.welcome}\n\n${nt.menuPrompt}\n\n${nt.opt1}\n${nt.opt2}\n${nt.opt3}\n${nt.opt4}\n\n${nt.opt0}`;
        } else if (textBase === '3') {
            await supabase.from('whatsapp_sessions').update({ language: 'isizulu', state: 'bot' }).eq('id', session.id);
            const nt = TRANSLATIONS.isizulu;
            return `${nt.welcome}\n\n${nt.menuPrompt}\n\n${nt.opt1}\n${nt.opt2}\n${nt.opt3}\n${nt.opt4}\n\n${nt.opt0}`;
        } else {
            return `*Welcome to Thusanang Assistance!*\n\n${TRANSLATIONS.english.langSelect}`;
        }
    }

    // STATE: Claims Document Intake Flow
    if (session.state === 'bot_claims_intake') {
        if (messageObj.type === 'image' || messageObj.type === 'document') {
            return t.docReceived;
        } else if (textBase === 'done') {
            await supabase.from('whatsapp_sessions').update({ state: 'agent' }).eq('id', session.id);
            return t.claimsFinished;
        } else {
            return t.claimsInstructions;
        }
    }

    // STATE: Default Main Menu (session.state === 'bot' or fallback)
    if (session.state === 'bot' || !session.state) {
        // If language isn't set somehow, force selection
        if (!session.language && session.state !== 'bot_language_selection') {
            await supabase.from('whatsapp_sessions').update({ state: 'bot_language_selection' }).eq('id', session.id);
            return `*Welcome to Thusanang Assistance!*\n\n${TRANSLATIONS.english.langSelect}`;
        }

        if (textBase === '1' || textBase.includes('application')) {
            responseText = t.appInfo;
        } 
        else if (textBase === '2' || textBase.includes('claim')) {
            await supabase.from('whatsapp_sessions').update({ state: 'bot_claims_intake' }).eq('id', session.id);
            responseText = t.claimsInfo;
        } 
        else if (textBase === '3' || textBase.includes('plan') || textBase.includes('price')) {
            responseText = t.plansInfo;
        } 
        else if (textBase === '4' || textBase.includes('pamphlet') || textBase.includes('brochure')) {
            responseText = t.pamphletInfo;
        }
        else {
            // Fallback Menu
            responseText = `${t.welcome}\n\n${t.menuPrompt}\n\n${t.opt1}\n${t.opt2}\n${t.opt3}\n${t.opt4}\n\n${t.opt0}\n\n_Powered by Thusanang_`;
        }
    }

    return responseText;
};

module.exports = {
    handleBotResponse
};
