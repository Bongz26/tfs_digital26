const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

// Initialize SendGrid
if (process.env.SMTP_PASS && process.env.SMTP_PASS.startsWith('SG.')) {
    sgMail.setApiKey(process.env.SMTP_PASS);
}

/**
 * Send an email using SendGrid or SMTP based on configuration
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email body (HTML)
 * @param {string} cc - Optional CC recipient
 */
async function sendEmail(to, subject, html, cc = null) {
    const fromMail = process.env.SENDGRID_FROM_EMAIL || process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;

    if (!to) {
        console.warn('⚠️ sendEmail called without recipient');
        return;
    }

    try {
        if (pass && pass.startsWith('SG.')) {
            const msg = {
                to,
                from: { email: fromMail, name: 'TFS Inventory' },
                subject,
                html
            };
            if (cc) msg.cc = cc;

            await sgMail.send(msg);
            console.log(`✅ Email sent via SendGrid to ${to}`);
        }
        else if (host && user && pass) {
            const port = parseInt(process.env.SMTP_PORT || '587', 10);
            const transporter = nodemailer.createTransport({
                host,
                port,
                secure: port === 465,
                auth: { user, pass }
            });

            await transporter.sendMail({ from: fromMail, to, cc, subject, html });
            console.log(`✅ Email sent via SMTP to ${to}`);
        } else {
            console.warn('⚠️ Email configuration missing (SMTP or SendGrid)');
        }
    } catch (e) {
        console.error('❌ Email send failed:', e.message);
        if (e.response) {
            console.error(e.response.body);
        }
    }
}

module.exports = { sendEmail };
