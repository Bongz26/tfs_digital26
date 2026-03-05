const cron = require('node-cron');
const axios = require('axios');

// Prevent Render free tier from sleeping by pinging our own health endpoint
const scheduleKeepAlive = () => {
    // Ping every 10 minutes (* * * * * is every minute, */10 is every 10)
    cron.schedule('*/10 * * * *', async () => {
        try {
            // Render environment variables usually include RENDER_EXTERNAL_URL
            const url = process.env.RENDER_EXTERNAL_URL
                ? `${process.env.RENDER_EXTERNAL_URL}/api/health`
                : 'https://tfs-digital.onrender.com/api/health';

            console.log(`[KeepAlive] Pinging ${url} to prevent sleep...`);
            const res = await axios.get(url);
            console.log(`[KeepAlive] Success: ${res.data.status}`);
        } catch (error) {
            console.error('[KeepAlive] Error pinging service:', error.message);
        }
    });

    console.log('🕒 KeepAlive scheduler initialized (pings every 10 minutes)');
};

module.exports = { scheduleKeepAlive };
