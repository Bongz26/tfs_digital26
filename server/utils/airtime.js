const { createClient } = require('@supabase/supabase-js');

/**
 * Trigger an airtime reward for a referrer
 * @param {object} supabase - Supabase client instance
 * @param {string} referrerPhone - The phone number of the person who shared the link
 * @param {string} referredPhone - The phone number of the new lead
 * @param {number} amount - Reward amount (default R50)
 */
async function triggerReferralReward(supabase, referrerPhone, referredPhone, amount = 50) {
    try {
        console.log(`🎁 Triggering R${amount} reward for ${referrerPhone} (Referred: ${referredPhone})`);

        // Check for existing reward to prevent double-payouts for the same referral
        // unique key: referrer + referred
        const { data: existing } = await supabase
            .from('airtime_requests')
            .select('id')
            .eq('phone_number', referrerPhone)
            .ilike('operator_notes', `%Referred: ${referredPhone}%`)
            .limit(1);

        if (existing && existing.length > 0) {
            console.log("⚠️ Reward already exists for this referral. Skipping duplicate.");
            return;
        }

        const { error } = await supabase
            .from('airtime_requests')
            .insert([{
                policy_number: `REF-${referredPhone.slice(-6)}`,
                beneficiary_name: `Referral Reward`,
                network: 'UNKNOWN', // Staff will pick network based on number
                phone_number: referrerPhone,
                amount: amount,
                status: 'pending',
                operator_notes: `Viral Referral Reward. Referred: ${referredPhone}`,
                requested_at: new Date().toISOString()
            }]);

        if (error) throw error;
        console.log("✅ Airtime reward request logged successfully.");
    } catch (err) {
        console.error("❌ Failed to trigger referral reward:", err.message);
    }
}

module.exports = {
    triggerReferralReward
};
