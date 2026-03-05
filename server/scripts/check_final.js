
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './server/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFinal() {
    const today = "2026-02-11";
    console.log(`Checking for date string: ${today}`);

    // Fetch last 50 cases to be absolutely sure we see today's
    const { data: allCases, error } = await supabase
        .from('cases')
        .select('id, case_number, created_at, status')
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) {
        console.error(error);
        return;
    }

    const todayCases = allCases.filter(c => c.created_at && c.created_at.startsWith(today));

    console.log(`\nSummary for ${today}:`);
    console.log(`Total cases found matching date: ${todayCases.length}`);
    todayCases.forEach(c => {
        console.log(` - Case: ${c.case_number} | Status: ${c.status} | Created: ${c.created_at}`);
    });

    const { data: allLogs, error: logErr } = await supabase
        .from('audit_log')
        .select('id, action, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

    if (logErr) {
        console.error(logErr);
    } else {
        const todayLogs = allLogs.filter(l => l.created_at && l.created_at.startsWith(today));
        const submissions = todayLogs.filter(l => l.action === 'case_create');
        console.log(`\nAudit Logs for ${today}:`);
        console.log(` - Total logs: ${todayLogs.length}`);
        console.log(` - Case submissions (case_create): ${submissions.length}`);
    }
}

checkFinal();
