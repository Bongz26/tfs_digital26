
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './server/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSubmissions() {
    const today = new Date().toISOString().split('T')[0];
    console.log(`Checking submissions for: ${today}`);

    // 1. Check Cases Table
    const { count: caseCount, error: caseErr } = await supabase
        .from('cases')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00`)
        .lt('created_at', `${today}T23:59:59`);

    if (caseErr) console.error('Error fetching cases:', caseErr);
    else console.log(`Cases created today (cases table): ${caseCount}`);

    // 2. Check Audit Log
    const { count: auditCount, error: auditErr } = await supabase
        .from('audit_log')
        .select('*', { count: 'exact', head: true })
        .eq('action', 'case_create')
        .gte('created_at', `${today}T00:00:00`)
        .lt('created_at', `${today}T23:59:59`);

    if (auditErr) console.error('Error fetching audit logs:', auditErr);
    else console.log(`Case creation logs today (audit_log): ${auditCount}`);
}

checkSubmissions();
