const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function checkAudit() {
    console.log('--- Checking Audit Log for 082 ---');
    const { data: logs, error } = await supabase
        .from('audit_log')
        .select('*')
        .or('new_values->>case_number.ilike.%082%,old_values->>case_number.ilike.%082%')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error:', error);
    } else {
        console.log(JSON.stringify(logs, null, 2));
    }
}

checkAudit();
