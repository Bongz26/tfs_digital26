const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function listUsers() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.from('user_profiles').select('*');
    if (error) {
        console.error('Error:', error);
        return;
    }
    console.log('Users found:', data.map(u => ({ email: u.email, role: u.role })));
}

listUsers();
