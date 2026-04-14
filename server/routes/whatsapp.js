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
    await axios({
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
  } catch (err) {
    console.error("❌ Error sending Meta message:", err.response ? JSON.stringify(err.response.data) : err.message);
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
  const supabase = req.app.locals.supabase;
  const body = req.body;

  // Make sure it's a WhatsApp API payload
  if (body.object === 'whatsapp_business_account') {

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
        
        // Handle incoming text 
        if (messageObj.type === 'text') {
          const messageText = messageObj.text.body;

          // 1. Get or Create Session
          let { data: session } = await supabase
            .from('whatsapp_sessions')
            .select('*')
            .eq('phone_number', phoneNumber)
            .single();

          if (!session) {
            const { data: newSession, error: createErr } = await supabase
              .from('whatsapp_sessions')
              .insert([{ phone_number: phoneNumber, user_name: userName, state: 'bot' }])
              .select().single();
            
            if (createErr) throw createErr;
            session = newSession;
          }

          // 2. Log User's Message
          await supabase.from('whatsapp_messages').insert([{
            session_id: session.id,
            sender: 'user',
            message_text: messageText
          }]);

          // Client exit command if in agent mode
          if (session.state === 'agent' && messageText.trim().toLowerCase() === 'end') {
             await supabase.from('whatsapp_sessions').update({ state: 'bot' }).eq('id', session.id);
             const endMsg = "You've successfully exited agent mode. You are back with the bot!";
             await supabase.from('whatsapp_messages').insert([{ session_id: session.id, sender: 'bot', message_text: endMsg }]);
             await sendWhatsAppMessage(phoneNumber, endMsg);
             return;
          }

          // 3. Process bot response if state is 'bot'
          if (session.state === 'bot') {
            const botReply = await handleBotResponse(supabase, phoneNumber, messageText);
            
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

module.exports = router;
