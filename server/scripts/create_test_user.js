const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function createTestUser() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
    const adminClient = createClient(supabaseUrl, supabaseKey);

    const email = 'test@demo.com';
    const password = 'password123';

    // Create user in Auth
    const { data: userData, error: userError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true
    });

    if (userError) {
        if (userError.message.includes('already registered')) {
            console.log('User already exists, that\'s fine.');
        } else {
            console.error('User Error:', userError);
            return;
        }
    }

    const userId = userData?.user?.id;
    if (userId) {
        // Create profile
        const { error: profileError } = await adminClient.from('user_profiles').upsert({
            user_id: userId,
            email: email,
            full_name: 'Test Admin',
            role: 'admin',
            active: true
        });
        if (profileError) console.error('Profile Error:', profileError);
        else console.log('✅ Test user created: test@demo.com / password123');
    }
}

createTestUser();
