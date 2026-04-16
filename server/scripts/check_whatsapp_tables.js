const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkAndCreateTables() {
    console.log('--- Checking WhatsApp Tables ---');

    // Check whatsapp_sessions
    const { data: sessions, error: sessErr } = await supabase
        .from('whatsapp_sessions').select('id').limit(1);
    
    if (sessErr) {
        console.log('❌ whatsapp_sessions table MISSING:', sessErr.message);
        console.log('Creating whatsapp_sessions...');
        await supabase.rpc('exec_sql', { sql: `
            CREATE TABLE IF NOT EXISTS whatsapp_sessions (
                id BIGSERIAL PRIMARY KEY,
                phone_number TEXT UNIQUE NOT NULL,
                user_name TEXT,
                state TEXT DEFAULT 'bot',
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
        `});
    } else {
        console.log('✅ whatsapp_sessions exists. Rows found:', sessions.length);
        console.log('Sessions:', JSON.stringify(sessions));
    }

    // Check whatsapp_messages
    const { data: msgs, error: msgErr } = await supabase
        .from('whatsapp_messages').select('id').limit(1);
    
    if (msgErr) {
        console.log('❌ whatsapp_messages table MISSING:', msgErr.message);
    } else {
        console.log('✅ whatsapp_messages exists. Rows found:', msgs.length);
    }

    // Show all sessions
    const { data: allSessions } = await supabase.from('whatsapp_sessions').select('*');
    console.log('\nAll sessions in DB:', JSON.stringify(allSessions, null, 2));

    process.exit(0);
}

checkAndCreateTables();
