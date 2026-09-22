const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function checkInventoryAudit() {
    console.log('--- Checking Audit Logs for inventory table (Last 48 hours) ---');

    const { data: logs, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('table_name', 'inventory')
        .gt('created_at', new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching audit_logs:', error.message);
        return;
    }

    console.log(`Found ${logs.length} inventory audit records:`);
    logs.forEach(l => {
        console.log(`[${l.created_at}] Action: ${l.action} | ID: ${l.record_id} | User: ${l.user_email} | Changes: ${JSON.stringify(l.changes)}`);
    });
}

checkInventoryAudit();
