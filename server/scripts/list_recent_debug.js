
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './server/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listRecent() {
    console.log("Listing last 5 cases...");
    const { data, error } = await supabase
        .from('cases')
        .select('id, case_number, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) console.error(error);
    else console.log(JSON.stringify(data, null, 2));

    console.log("Listing last 20 audit logs...");
    const { data: audit, error: auditErr } = await supabase
        .from('audit_log')
        .select('id, action, created_at')
        .order('created_at', { ascending: false })
        .limit(20);

    if (auditErr) console.error(auditErr);
    else console.log(JSON.stringify(audit, null, 2));
}

listRecent();
