
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './server/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDetailed() {
    const today = new Date().toISOString().split('T')[0];
    console.log(`Checking details for: ${today}`);

    // 1. All cases created today
    const { data: cases, error: caseErr } = await supabase
        .from('cases')
        .select('id, case_number, created_at, status')
        .gte('created_at', `${today}T00:00:00Z`)
        .lt('created_at', `${today}T23:59:59Z`);

    if (caseErr) console.error(caseErr);
    else {
        console.log(`Cases created (today): ${cases.length}`);
        cases.forEach(c => console.log(` - Case ${c.case_number} (${c.status}) at ${c.created_at}`));
    }

    // 2. All audit logs today
    const { data: logs, error: logErr } = await supabase
        .from('audit_log')
        .select('id, action, created_at, resource_id')
        .gte('created_at', `${today}T00:00:00Z`)
        .lt('created_at', `${today}T23:59:59Z`);

    if (logErr) console.error(logErr);
    else {
        console.log(`Audit logs (today): ${logs.length}`);
        const creates = logs.filter(l => l.action === 'case_create');
        console.log(` - 'case_create' actions: ${creates.length}`);
        const statusChanges = logs.filter(l => l.action === 'case_status_change');
        console.log(` - 'case_status_change' actions: ${statusChanges.length}`);
    }
}

checkDetailed();
