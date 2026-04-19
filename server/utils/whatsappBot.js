const { getRecommendedPlans } = require('./plans');
const { triggerReferralReward } = require('./airtime');

const TRANSLATIONS = {
    english: {
        welcome: "*Welcome to Thusanang Assistance!*",
        langSelect: "Please choose your preferred language:\n1. English\n2. Sesotho\n3. IsiZulu",
        menuPrompt: "How can we assist you today? Please reply with a number to choose an option:",
        opt1: "1. New Application / Get Quote",
        opt2: "2. Claims Information",
        opt3: "3. Plans & Pricing",
        opt4: "4. Obtain Pamphlet",
        opt5: "5. Share & Earn (R50 Reward)",
        opt0: "0. Chat with an Agent",
        agentConnecting: "I am connecting you to a live agent. Please hold on, they will respond shortly. Type 'end' if you wish to close this chat.",
        appInfo: "*New Application*\nPlease use our secure online portal to log an application: https://admintfs.onrender.com\n\nOr, reply with *QUOTE* to get a customized recommendation right here!",
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
        invalidSelection: "Invalid selection. Please choose a valid number from the menu.",
        
        // Quoting Flow
        quoteCoverage: "Great! Let's get you a quote. Who are you looking to cover?\n1. Just Me (Single)\n2. My Family\n3. A Society (Motjha)",
        quoteAge: "How old is the main member? (Please reply with a number, e.g. 45)",
        quoteMembers: "How many members are in your society? (e.g. 6, 10 or 14)",
        quoteBudget: "What is your maximum monthly budget? (e.g. 150)",
        quoteNoResults: "I couldn't find a plan matching those exact details. Connecting you to an agent to help customize one for you...",
        quoteRecommend: "Based on your details, here are our top recommendations for you:",
        quoteSelect: "Reply with the *Plan Name* (e.g., Gold) to start your application, or *0* to talk to an agent.",
        quoteOnboardingName: "Excellent choice! To start your application, please provide your *Full Name*:",
        quoteOnboardingId: "Thank you. Finally, please provide your *ID Number*:",
        quoteSuccess: "Perfect! I've created a draft application for you. One of our consultants will call you shortly to finalize the details and activate your cover. Welcome to Thusanang!",

        // Society Portal Logic
        opt6: "6. Society Portal (Treasurers)",
        socLoginPrompt: "Please enter your *Society Policy Number* to access the management portal:",
        socDashboard: "Society: *{name}*\n\n📈 Members: {count}\n📄 Missing Details: {missing}\n\nWhat would you like to do?\n1. Add New Member\n2. Report a Death (Claim)\n0. Back to Main Menu",
        socError: "I couldn't find a society with that policy number. Please double check and try again, or chat with an agent."
    },
    sesotho: {
        welcome: "*Re u amohela ho Thusanang Assistance!*",
        langSelect: "Ka kopo khetha puo ea hau:\n1. English\n2. Sesotho\n3. IsiZulu",
        menuPrompt: "Re ka u thusa joang kajeno? Ka kopo araba ka nomoro ho khetha:",
        opt1: "1. Kopo e Ncha / Fumana Quote",
        opt2: "2. Litaba tsa Likleime",
        opt3: "3. Merero le Litheko",
        opt4: "4. Fumana Pampiri",
        opt5: "5. Arolelana mme u Fumane (R50)",
        opt6: "6. Portal ea Mekhatlo (Baokameli)",
        opt0: "0. Bua le Moemeli",
        agentConnecting: "Ke u hokahanya le moemeli wa rona. Ka kopo emanyana, o tla u araba haufinyane. Ngola 'end' haeba u batla ho koala moqoqo ona.",
        appInfo: "*Kopo e Ncha*\nka kopo sebelisa portal ea rona e sireletsehileng ho kenya kopo: https://admintfs.onrender.com\n\nKapa, araba ka *QUOTE* ho fumana khothaletso mona!",
        claimsInfo: "Ho potlakisa tleime ea hau, ka kopo fana ka litokomane tse latelang tse hlokahalang:\n\n" +
                    "- Khopi e netefalitsoeng ea setifikeiti sa semmuso sa lefu\n" +
                    "- Khopi e netefalitsoeng ea ID ea mojalefa (mahlale a mabeli)\n" +
                    "- Khopi e netefalitsoeng ea ID ea mofu (mahlale a mabeli)\n" +
                    "- Foromo e tlatsweng ea BI/DHA-1663 (maqephe ohle a 3)\n" +
                    "- Setatemente sa banka se setempetsoeng sa mojalefa (se sa feteng likhoeli tse 3)\n\n" +
                    "Ka kopo kenya linepe kapa li-PDF tsa litokomane tsena mona. Araba ka 'done' ha u qetile ho li kenya kaofela.",
        plansInfo: "*Merero le Litheko*\nThusanang e fana ka merero e fapaneng dea lepato e lokiselitsoeng ho amohela boholo ba malapa a fapaneng le litlhoko.\n\nKa kopo araba ka *0* ho hokahana le moemeli bakeng sa thulaganyo le qotulo ea hau.",
        pamphletInfo: "*Fumana Pampiri*\nBukana ea rona ea dijithale e tla fumaneha bakeng sa ho khoasolloa mona haufinyane. Bakeng sa thuso ea hang-hang, ka kopo araba ka *0* ho hokahana le moemeli.",
        docReceived: "Tokomane e amohetsoe ka mokhoa o sireletsehileng. Ka kopo kenya tokomane e latelang, kapa u arabe ka 'done' ha u qetile.",
        claimsFinished: "Kea leboha. Litokomane tsa hau tsa tleime li amohetsoe mme li fetiselitsoe lefapheng la rona la likleime.\n\nU hokahantsoe le moemeli bakeng sa netefatso ea ho qetela. Ka kopo emanyana.",
        claimsInstructions: "Ka kopo kenya linepe kapa li-PDF tsa litokomane mona hle.\n\nAraba ka 'done' ha u qetile, kapa '0' ho bua le moemeli hang-hang.",
        invalidSelection: "Khetho ha e ea nepahala. Ka kopo khetha nomoro e nepahetseng lenaneong.",

        // Quoting Flow (Sesotho)
        quoteCoverage: "Hantle! Ha re u fe quote. U batla ho koahela mang?\n1. Ke nna feela (Single)\n2. Lelapa la ka\n3. Mokhatlo (Motjha)",
        quoteAge: "Setho se seholo se na le lilemo tse kae? (Ka kopo araba ka nomoro, mohlala 45)",
        quoteMembers: "Ho na le litho tse kae mokhatlong oa hau? (mohlala 6, 10 kapa 14)",
        quoteBudget: "Tekanyetso ea hau ea khoeli le khoeli ke bokae? (mohlala 150)",
        quoteNoResults: "Ha kea khona ho fumana morero o lumellanang le lintlha tseo. Ke u hokahanya le moemeli ho u thusa...",
        quoteRecommend: "Ho latela lintlha tsa hau, mona ke likhothaletso tsa rona tse ka sehloohong:",
        quoteSelect: "Araba ka *Lebitso la Morero* (mohlala, Gold) ho qala kopo ea hau, kapa *0* ho bua le moemeli.",
        quoteOnboardingName: "Khetho e ntle haholo! Ho qala kopo ea hau, ka kopo fana ka *Lebitso la hau ka ho tlala*:",
        quoteOnboardingId: "Kea leboha. qetellong, ka kopo fana ka *Nomoro ea ID*:",
        quoteSuccess: "E phethehile! Ke u etselitse kopo ea mohlala. E mong oa baeletsi ba rona o tla u letsetsa haufinyane. Rea u amohela Thusanang!",

        // Referral Logic (Sesotho)
        referralInfo: "🎁 *Arolelana mme u Fumane R50!*\n\nMeme metsoalle le ba lelapa ho fumana quote ho Thusanang. Bakeng sa motho e mong le e mong ea qetang quote le netefatso ea ID, u fumana *R50 Airtime*!\n\n*Link ea hau ea ho mema:*\n{link}\n\nArolelana molaetsa ona o ka tlase le mabitso a hau! ⬇️",
        referralInvite: "Dumela! Ke sa tsoa fumana quote ea funeral policy ho Thusanang ka motsotso o le mong ho WhatsApp. E leke mona: {link}",

        // Society Portal (Sesotho)
        opt6: "6. Portal ea Mekhatlo",
        socLoginPrompt: "Ka kopo kenya *Nomoro ea Policy ea Mokhatlo* oa hau:",
        socDashboard: "Mokhatlo: *{name}*\n\n📈 Litho: {count}\n📄 Lintlha tse haellang: {missing}\n\nU batla ho etsa'ng?\n1. Kenya Setho se Secha\n2. Tlaleha Lefu (Claim)\n0. Khutlela ho Menu",
        socError: "Ha kea khona ho fumana mokhatlo ka nomoro eo. Ka kopo hlahloba hape, kapa u bue le moemeli."
    },
    isizulu: {
        welcome: "*Siyakwamukela ku-Thusanang Assistance!*",
        langSelect: "Sicela ukhethe ulimi lwakho:\n1. English\n2. Sesotho\n3. IsiZulu",
        menuPrompt: "Singakusiza kanjani namuhla? Sicela uphendule ngenombolo ukuze ukhethe:",
        opt1: "1. Isicelo Esisha / Thola i-Quote",
        opt2: "2. Imininingwane Yezicelo",
        opt3: "3. Izinhlelo Nezintengo",
        opt4: "4. Thola iBhrusha",
        opt5: "5. Yabelana futhi Uzuze (R50)",
        opt6: "6. Ingosi Yezinhlangano",
        opt0: "0. Khuluma no-Agent",
        agentConnecting: "Ngikuxhumanisa no-agent wethu. Sicela ulinde kancane, uzokuphendula maduze. Bhala 'end' uma ufuna ukuvala le ngxoxo.",
        appInfo: "*Isicelo Esisha*\nSicela usebenzise ingosi yethu evikelekile ukufaka isicelo: https://admintfs.onrender.com\n\nNoma, phendula ngokuthi *QUOTE* ukuze uthole isincomo lapha!",
        claimsInfo: "Ukuze usheshise isimangalo sakho, sicela unikeze le mibhalo elandelayo edingekayo:\n\n" +
                    "- Ikhophia eqinisekisiwe yesitifiketi sokushona esisemthethweni\n" +
                    "- Ikhophia eqinisekisiwe kamazisi (ID) womhlomuli (nxazonke)\n" +
                    "- Ikhophia eqinisekisiwe kamazisi (ID) kamufi (nxazonke)\n" +
                    "- Ifomu eligcwalisiwe le-BI/DHA-1663 (wonke amakhasi ama-3)\n" +
                    "- Isitatimende sasebhange esinezitembu somhlomuli (esingeqile ezinyangeni ezi-3)\n\n" +
                    "Sicela ufake izithombe noma ama-PDF ale mibhalo lapha. Phendula ngokuthi 'done' uma usuqedile ukuyifaka yonke.",
        plansInfo: "*Izinhlelo Nezintengo*\nI-Thusanang ihlinzeka ngezinhlelo zomngcwabo ezahlukene eziklanyelwe ukuhlinzeka imindeni yabo bonke osayizi nezidingo.\n\nSicela uphendule ngo-*0* ukuze uxhumane no-agent ukuze uthole imininingwane nentengo yakho.",
        pamphletInfo: "*Thola iBhrusha*\nIbhuloshu yethu yedijithali azotholakala lapha maduze. Ukuze uthole usizo olusheshayo nemininingwane, sicela uphendule ngo-*0* ukuze uxhumane no-agent.",
        docReceived: "Umbhalo ufunyenwe ngokuphepha. Sicela ufake umbhalo olandelayo, noma uphendule ngokuthi 'done' uma usuqedile.",
        claimsFinished: "Siyabonga. Imibhalo yakho yesimangalo ifunyenwe futhi idluliselwe emnyangweni wethu wezicelo.\n\nUxhunyiwe no-agent ukuze kuqinisekiswe okokugcina. Sicela ulinde.",
        claimsInstructions: "Sicela ufake izithombe noma ama-PDF emibhalo edingekayo lapha.\n\nPhendula ngokuthi 'done' uma usuqedile, noma '0' ukuze ukhulume no-agent manje.",
        invalidSelection: "Ukukhetha akulungile. Sicela ukhethe inombolo elungile kumenyu.",

        // Quoting Flow (Zulu)
        quoteCoverage: "Kuhle! Masikutholele i-quote. Ubani ofuna ukumvikelia?\n1. Mina kuphela (Single)\n2. Umndeni wami\n3. Inhlangano (Motjha)",
        quoteAge: "Uneminyaka emingaki ilungu eliyinhloko? (Sicela uphendule ngenombolo, mhlala 45)",
        quoteMembers: "Mangaki amalungu enhlangano yakho? (mhlala 6, 10 noma 14)",
        quoteBudget: "Yimalini isabelomali sakho sanyanga zonke? (mhlala 150)",
        quoteNoResults: "Angikwazanga ukuthola uhlelo olufana naleyo mininingwane. Ngikuxhumanisa no-agent ukuze akusize...",
        quoteRecommend: "Ngokusekelwe emininingwaneni yakho, nazi izincomo zethu eziphezulu kuwe:",
        quoteSelect: "Phendula *Ngegamala Lohlelo* (mhlala, Gold) ukuze uqale isicelo sakho, noma *0* ukuze ukhulume no-agent.",
        quoteOnboardingName: "Ukukhetha okuhle kakhulu! Ukuze uqale isicelo sakho, sicela unikeze *Igama Lakho Eligcwele*:",
        quoteOnboardingId: "Ngiyabonga. Okokugcina, sicela unikeze *Inombolo yakho kamazisi (ID)*:",
        quoteSuccess: "Kuphelele! Ngikwakhele isicelo esisalungiswa. Omunye wabeluleki bethu uzokufonela maduze. Siyakwamukela ku-Thusanang!",

        // Referral Logic (Zulu)
        referralInfo: "🎁 *Yabelana futhi Uzuze i-R50!*\n\nMema abangani bakho nomndeni wakho ukuthi bathole i-quote e-Thusanang. Kulowo nalowo muntu oqedela i-quote nokuqinisekiswa kwe-ID, uthola *i-R50 Airtime*!\n\n*Isixhumanisi sakho:*\n{link}\n\nThumela lo mlayezo ngezansi koxhumana nabo! ⬇️",
        referralInvite: "Sawubona! Ngisanda kuthola i-quote yenqubomgomo yomngcwabo kwa-Thusanang ngomzuzu owodwa ku-WhatsApp. Izame lapha: {link}",

        // Society Portal (Zulu)
        opt6: "6. Ingosi Yezinhlangano",
        socLoginPrompt: "Sicela ufake *Inombolo ye-Policy yeNhlangano* yakho ukuze ungene:",
        socDashboard: "Inhlangano: *{name}*\n\n📈 Amalungu: {count}\n📄 Imininingwane engekhoyo: {missing}\n\nUfuna ukwenzani?\n1. Faka iLungu Elisha\n2. Bika Ukushona (Claim)\n0. Buyela emuva",
        socError: "Angikwazanga ukuthola inhlangano ngaleyo nombolo. Sicela uhlole futhi, noma ukhulume no-agent."
    }
};

const handleBotResponse = async (supabase, session, messageText, messageObj) => {
    let responseText = "";
    const textBase = (messageText || "").trim().toLowerCase();
    const lang = session.language || 'english';
    const t = TRANSLATIONS[lang] || TRANSLATIONS.english;
    const funnel = session.funnel_data || {};

    // Helper to update funnel data
    const updateFunnel = async (newData) => {
        const updated = { ...funnel, ...newData };
        await supabase.from('whatsapp_sessions').update({ funnel_data: updated }).eq('id', session.id);
        return updated;
    };

    // Universal escalation or cancel (from any state)
    if (messageObj.type === 'text' && (textBase === '0' || textBase.includes('agent') || textBase === 'cancel')) {
        await supabase
            .from('whatsapp_sessions')
            .update({ state: 'agent' })
            .eq('id', session.id);
        
        return t.agentConnecting;
    }

    // TRIGGER QUOTE FLOW
    if (textBase === 'quote' || textBase.includes('get quote')) {
        await supabase.from('whatsapp_sessions').update({ state: 'bot_quote_start' }).eq('id', session.id);
        return t.quoteCoverage;
    }

    // STATE: Language Selection
    if (session.state === 'bot_language_selection') {
        const stateMapping = { '1': 'english', '2': 'sesotho', '3': 'isizulu' };
        if (stateMapping[textBase]) {
            const chosenLang = stateMapping[textBase];
            await supabase.from('whatsapp_sessions').update({ language: chosenLang, state: 'bot' }).eq('id', session.id);
            const nt = TRANSLATIONS[chosenLang];
            return `${nt.welcome}\n\n${nt.menuPrompt}\n\n${nt.opt1}\n${nt.opt2}\n${nt.opt3}\n${nt.opt4}\n${nt.opt5}\n${nt.opt6}\n\n${nt.opt0}`;
        }
        return `*Welcome to Thusanang Assistance!*\n\n${TRANSLATIONS.english.langSelect}`;
    }

    // --- SOCIETY PORTAL STATES ---
    if (session.state === 'bot_society_login') {
        const polNo = textBase.toUpperCase();
        const { data: members, error } = await supabase
            .from('cases')
            .select('deceased_name, deceased_id, policy_number')
            .eq('policy_number', polNo);

        if (error || !members || members.length === 0) {
            return t.socError;
        }

        const missingDetails = members.filter(m => !m.deceased_id).length;
        const societyName = members[0].deceased_name.split(' ')[0] + " Society"; // Heuristic
        const dashboard = t.socDashboard
            .replace(/{name}/g, societyName)
            .replace(/{count}/g, members.length)
            .replace(/{missing}/g, missingDetails);

        await updateFunnel({ societyPolicy: polNo, societyName });
        await supabase.from('whatsapp_sessions').update({ state: 'bot_society_dashboard' }).eq('id', session.id);
        return dashboard;
    }

    if (session.state === 'bot_society_dashboard') {
        if (textBase === '1') {
            await updateFunnel({ category: 'motjha', policy_number: funnel.societyPolicy });
            await supabase.from('whatsapp_sessions').update({ state: 'bot_quote_members' }).eq('id', session.id);
            return t.quoteMembers;
        }
        if (textBase === '2') {
            await supabase.from('whatsapp_sessions').update({ state: 'bot_claims_intake' }).eq('id', session.id);
            return t.claimsInstructions;
        }
        if (textBase === '0') {
            await supabase.from('whatsapp_sessions').update({ state: 'bot' }).eq('id', session.id);
            return `${t.welcome}\n\n${t.menuPrompt}\n\n${t.opt1}\n${t.opt2}\n${t.opt3}\n${t.opt4}\n${t.opt5}\n${t.opt6}\n\n${t.opt0}`;
        }
        return t.socDashboard
                .replace(/{name}/g, funnel.societyName)
                .replace(/{count}/g, '...') // Re-fetch logic omitted for brevity
                .replace(/{missing}/g, '...')
            + "\n\n" + t.invalidSelection;
    }

    // --- QUOTING FLOW STATES ---
    
    if (session.state === 'bot_quote_start') {
        const map = { '1': 'single', '2': 'family', '3': 'motjha' };
        if (map[textBase]) {
            await updateFunnel({ category: map[textBase] });
            await supabase.from('whatsapp_sessions').update({ state: map[textBase] === 'motjha' ? 'bot_quote_members' : 'bot_quote_age' }).eq('id', session.id);
            return map[textBase] === 'motjha' ? t.quoteMembers : t.quoteAge;
        }
        return t.quoteCoverage;
    }

    if (session.state === 'bot_quote_members' || session.state === 'bot_quote_age') {
        const val = parseInt(textBase);
        if (!isNaN(val)) {
            await updateFunnel(session.state === 'bot_quote_members' ? { members: val } : { age: val });
            await supabase.from('whatsapp_sessions').update({ state: 'bot_quote_budget' }).eq('id', session.id);
            return t.quoteBudget;
        }
        return session.state === 'bot_quote_members' ? t.quoteMembers : t.quoteAge;
    }

    if (session.state === 'bot_quote_budget') {
        const budget = parseInt(textBase);
        if (!isNaN(budget)) {
            const currentFunnel = await updateFunnel({ budget });
            const recommendations = getRecommendedPlans(currentFunnel.category, currentFunnel.category === 'motjha' ? currentFunnel.members : currentFunnel.age, budget);
            
            if (recommendations.length === 0) {
                await supabase.from('whatsapp_sessions').update({ state: 'agent' }).eq('id', session.id);
                return t.quoteNoResults;
            }

            let resp = `${t.quoteRecommend}\n\n`;
            recommendations.forEach(p => {
                resp += `🏆 *${p.name}*\n💰 Price: R${p.price}/pm\n\n`;
            });
            resp += t.quoteSelect;
            
            await supabase.from('whatsapp_sessions').update({ state: 'bot_quote_recommend' }).eq('id', session.id);
            return resp;
        }
        return t.quoteBudget;
    }

    if (session.state === 'bot_quote_recommend') {
        const recommendations = getRecommendedPlans(funnel.category, funnel.category === 'motjha' ? funnel.members : funnel.age, funnel.budget);
        const match = recommendations.find(p => textBase.includes(p.name.toLowerCase()));
        
        if (match) {
            await updateFunnel({ selectedPlan: match.name, selectedPrice: match.price });
            await supabase.from('whatsapp_sessions').update({ state: 'bot_quote_onboarding_name' }).eq('id', session.id);
            return t.quoteOnboardingName;
        }
        return t.quoteSelect;
    }

    if (session.state === 'bot_quote_onboarding_name') {
        if (textBase.length > 3) {
            await updateFunnel({ fullName: messageText });
            await supabase.from('whatsapp_sessions').update({ state: 'bot_quote_onboarding_id' }).eq('id', session.id);
            return t.quoteOnboardingId;
        }
        return t.quoteOnboardingName;
    }

    if (session.state === 'bot_quote_onboarding_id') {
        if (/^\d{6,13}$/.test(textBase)) {
            const finalFunnel = await updateFunnel({ idNumber: textBase });
            
            const draftData = {
                policy_number: `WA-${session.phone_number.slice(-4)}-${Date.now().toString().slice(-4)}`,
                deceased_name: finalFunnel.fullName,
                deceased_id: finalFunnel.idNumber,
                plan_category: finalFunnel.category,
                plan_name: finalFunnel.selectedPlan,
                total_price: finalFunnel.selectedPrice,
                status: 'intake',
                source: 'whatsapp_bot'
            };

            await supabase.from('claim_drafts').insert([{
                policy_number: draftData.policy_number,
                department: 'sales',
                data: { ...draftData, status: 'whatsapp_lead' }
            }]);

            // TRIGGER REFERRAL REWARD
            if (finalFunnel.referred_by) {
                await triggerReferralReward(supabase, finalFunnel.referred_by, session.phone_number, 50);
            }

            await supabase.from('whatsapp_sessions').update({ state: 'bot' }).eq('id', session.id);
            return t.quoteSuccess;
        }
        return t.quoteOnboardingId;
    }

    // --- REFERRAL INFO STATE ---
    if (session.state === 'bot_referral_info') {
        // Just return to bot menu after showing info
        await supabase.from('whatsapp_sessions').update({ state: 'bot' }).eq('id', session.id);
    }

    // --- EXISTING FLOWS ---

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

    // STATE: Default Main Menu
    if (session.state === 'bot' || !session.state) {
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
        else if (textBase === '5' || textBase.includes('earn') || textBase.includes('share')) {
            const refLink = `https://wa.me/27604965026?text=REFERRED_BY_${session.phone_number}`;
            responseText = t.referralInfo.replace(/{link}/g, refLink) + "\n\n" + t.referralInvite.replace(/{link}/g, refLink);
            await supabase.from('whatsapp_sessions').update({ state: 'bot_referral_info' }).eq('id', session.id);
        }
        else if (textBase === '6' || textBase.includes('society')) {
            responseText = t.socLoginPrompt;
            await supabase.from('whatsapp_sessions').update({ state: 'bot_society_login' }).eq('id', session.id);
        }
        else {
            responseText = `${t.welcome}\n\n${t.menuPrompt}\n\n${t.opt1}\n${t.opt2}\n${t.opt3}\n${t.opt4}\n${t.opt5}\n${t.opt6}\n\n${t.opt0}\n\n_Powered by Thusanang_`;
        }
    }

    return responseText;
};

module.exports = {
    handleBotResponse
};
