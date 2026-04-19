const express = require('express');
const router = express.Router();
const axios = require('axios');
const { handleBotResponse } = require('../utils/whatsappBot');

// Meta WhatsApp Cloud API credentials
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'tfs_digital_secret_token';
const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

// Helper to send message via Meta
async function sendWhatsAppMessage(to, messageText) {
  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    console.warn("⚠️ Cannot send WhatsApp message - Token or Phone Number ID missing in .env");
    return;
  }
    try {
      const response = await axios({
        method: "POST",
        url: `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        data: {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: to,
          type: "text",
          text: { body: messageText },
        },
      });
      console.log(`✅ Meta Msg Sent to ${to}:`, response.data.messages[0].id);
    } catch (err) {
    const errorData = err.response ? JSON.stringify(err.response.data) : err.message;
    console.error(`❌ Meta Send Error [${to}]:`, errorData);
    // Silent fail in UI but logged for admin diagnostics
  }
}

// GET /api/whatsapp/webhook - Webhook Verification from Meta
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ WhatsApp Webhook Verified');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// POST /api/whatsapp/webhook - Incoming messages from users
router.post('/webhook', async (req, res) => {
  console.log("🔔 WEBHOOK PING: Request received at", new Date().toISOString());
  const supabase = req.app.locals.supabase;
  const body = req.body;

  // Log incoming webhook for audit
  if (body.object === 'whatsapp_business_account') {
    console.log("📥 WhatsApp Webhook Received:", JSON.stringify(body, null, 2));

    // Acknowledge receipt to Meta immediately
    res.sendStatus(200);

    // Safely extract the message info
    try {
      if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]
      ) {
        const payload = body.entry[0].changes[0].value;
        const messageObj = payload.messages[0];
        const phoneNumber = messageObj.from; 
        const userName = payload.contacts && payload.contacts[0].profile ? payload.contacts[0].profile.name : '';
        
        // Handle incoming messages safely across text, images, and documents
        const supportedTypes = ['text', 'image', 'document'];
        if (supportedTypes.includes(messageObj.type)) {
          let messageText = '';
          if (messageObj.type === 'text') {
             messageText = messageObj.text.body;
          } else if (messageObj.type === 'image') {
             messageText = `[Image Uploaded - ID: ${messageObj.image.id}]`;
          } else if (messageObj.type === 'document') {
             messageText = `[Document Uploaded - ID: ${messageObj.document.id}]`;
          }

          // --- REFERRAL DETECTION ---
          let referralSource = null;
          if (messageText && messageText.toUpperCase().startsWith('REFERRED_BY_')) {
            referralSource = messageText.split('_').pop().trim();
            console.log(`🔗 Referral Detected! Source: ${referralSource}`);
          }

          // 1. Get or Create Session
          let { data: session } = await supabase
            .from('whatsapp_sessions')
            .select('*')
            .eq('phone_number', phoneNumber)
            .single();

          if (!session) {
            const { data: newSession, error: createErr } = await supabase
              .from('whatsapp_sessions')
              .insert([{ 
                phone_number: phoneNumber, 
                user_name: userName, 
                state: 'bot_language_selection',
                funnel_data: referralSource ? { referred_by: referralSource } : {}
              }])
              .select().single();
            
            if (createErr) throw createErr;
            session = newSession;
          } else if (referralSource && (!session.funnel_data || !session.funnel_data.referred_by)) {
            // Update existing session if referral was missed
            const updatedFunnel = { ...(session.funnel_data || {}), referred_by: referralSource };
            const { data: updatedSession } = await supabase
              .from('whatsapp_sessions')
              .update({ funnel_data: updatedFunnel })
              .eq('id', session.id)
              .select().single();
            if (updatedSession) session = updatedSession;
          }

          // 2. Log User's Message
          await supabase.from('whatsapp_messages').insert([{
            session_id: session.id,
            sender: 'user',
            message_text: messageText
          }]);

          // Client exit command if in agent mode
          if (session.state === 'agent' && messageObj.type === 'text' && messageText.trim().toLowerCase() === 'end') {
             await supabase.from('whatsapp_sessions').update({ state: 'bot_language_selection' }).eq('id', session.id);
             const endMsg = "You've successfully exited agent mode. You are back with the bot!";
             await supabase.from('whatsapp_messages').insert([{ session_id: session.id, sender: 'bot', message_text: endMsg }]);
             await sendWhatsAppMessage(phoneNumber, endMsg);
             return;
          }

          // 3. Process bot response if state is 'bot' or any 'bot_' sub-state
          if (session.state && session.state.startsWith('bot')) {
            const botReply = await handleBotResponse(supabase, session, messageText, messageObj);
            
            // Log Bot's Reply
            await supabase.from('whatsapp_messages').insert([{
              session_id: session.id,
              sender: 'bot',
              message_text: botReply
            }]);

            // Dispatch Meta API POST
            await sendWhatsAppMessage(phoneNumber, botReply);
          }
        }
      }
    } catch (err) {
      console.error("❌ Webhook processing error:", err.message);
    }
  } else {
    res.sendStatus(404);
  }
});

// Admin Route: Get all active sessions (agent and bot)
router.get('/sessions', async (req, res) => {
  const supabase = req.app.locals.supabase;
  try {
    const { data: sessions, error } = await supabase
      .from('whatsapp_sessions')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Route: Get messages for a session
router.get('/sessions/:id/messages', async (req, res) => {
  const supabase = req.app.locals.supabase;
  const { id } = req.params;
  try {
    const { data: messages, error } = await supabase
      .from('whatsapp_messages')
      .select('*')
      .eq('session_id', id)
      .order('timestamp', { ascending: true });

    if (error) throw error;
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Route: Send Agent Reply
router.post('/agent/send', async (req, res) => {
  const supabase = req.app.locals.supabase;
  const { sessionId, phoneNumber, messageText } = req.body;

  if (!sessionId || !phoneNumber || !messageText) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Log Agent Message
    await supabase.from('whatsapp_messages').insert([{
      session_id: sessionId,
      sender: 'agent',
      message_text: messageText
    }]);

    await sendWhatsAppMessage(phoneNumber, messageText);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Route: Close Ticket
router.post('/agent/close', async (req, res) => {
  const supabase = req.app.locals.supabase;
  const { sessionId, phoneNumber } = req.body;

  try {
    await supabase.from('whatsapp_sessions').update({ state: 'bot' }).eq('id', sessionId);
    const closeMsg = "✅ The agent has resolved this query and closed the ticket. Message us here anytime if you need something else!";
    
    await supabase.from('whatsapp_messages').insert([{
      session_id: sessionId,
      sender: 'bot',
      message_text: closeMsg
    }]);

    await sendWhatsAppMessage(phoneNumber, closeMsg);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Public Route: Privacy Policy (Required for Meta App Live Mode)
router.get('/privacy', (req, res) => {
  res.send(`
    <html>
      <head><title>Privacy Policy - TFS Digital</title></head>
      <body style="font-family: sans-serif; padding: 40px; line-height: 1.6;">
        <h1>Privacy Policy</h1>
        <p>At TFS Digital, we respect your privacy and are committed to protecting your personal data.</p>
        <h2>1. Information We Collect</h2>
        <p>We only collect information necessary to provide funeral assistance services via WhatsApp, including your phone number and chat history.</p>
        <h2>2. How We Use Information</h2>
        <p>Your data is used solely to facilitate communication between you and our agents or automated bot system.</p>
        <h2>3. Data Security</h2>
        <p>We implement industry-standard security measures to protect your information stored in our secure database.</p>
        <h2>4. Contact Us</h2>
        <p>If you have questions about this policy, contact us at manager@thusanangfs.co.za</p>
      </body>
    </html>
  `);
});

module.exports = router;
