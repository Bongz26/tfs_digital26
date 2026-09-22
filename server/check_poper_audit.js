const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function checkPoperAudit() {
    console.log('--- Checking audit_log (Singular) for Item 35 ---');

    const { data: logs, error } = await supabase
        .from('audit_log')
        .select('*')
        .eq('resource_id', 35)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching audit_log:', error.message);
        return;
    }

    console.log(`Found ${logs.length} audit records for Item 35:`);
    logs.forEach(l => {
        console.log(`[${l.created_at}] Action: ${l.action} | User: ${l.user_email} | Old: ${JSON.stringify(l.old_values)} | New: ${JSON.stringify(l.new_values)}`);
    });
}

checkPoperAudit();
