const nodemailer = require('nodemailer');

/**
 * Gmail requires an App Password, not your regular Gmail password.
 * 
 * Steps to generate an App Password:
 * 1. Go to myaccount.google.com/security
 * 2. Enable 2-Step Verification if not already enabled
 * 3. Search for "App Passwords" → select app: Mail, device: Other/Windows Computer
 * 4. Name it "Portfolio CMS"
 * 5. Copy the 16-character password
 * 6. Paste it as EMAIL_PASS in your .env file
 * 
 * IMPORTANT: Never use your actual Gmail password here. Always use the App Password.
 */

// Initialize Nodemailer transporter for Gmail SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 465,
  secure: true, // SSL/TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send email notification when a visitor submits the contact form
 * @param {Object} data - Contact form data
 * @param {string} data.name - Sender's name
 * @param {string} data.email - Sender's email address
 * @param {string} data.subject - Email subject
 * @param {string} data.message - Email message body
 * 
 * Note: This function does NOT throw on error. Email failures are logged silently
 * to ensure the contact submission always succeeds from the user's perspective.
 */
async function sendContactNotification(data) {
  try {
    const { name, email, subject, message } = data;

    const htmlContent = `
     <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background: #0f0f0f; margin: 0; padding: 20px; }
    .container { max-width: 560px; margin: 0 auto; background: #1c1c1e; border-radius: 12px; overflow: hidden; border: 0.5px solid #2e2e2e; }

    .header { background: #1e1b4b; padding: 28px 28px 24px; display: flex; align-items: center; gap: 14px; }
    .header-icon { width: 44px; height: 44px; border-radius: 50%; background: rgba(139,92,246,0.25); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .header-icon i { font-size: 20px; color: #a78bfa; }
    .header-text h1 { margin: 0; font-size: 17px; font-weight: 500; color: #e0d9ff; }
    .header-text p { margin: 3px 0 0; font-size: 12px; color: #9d8fd4; }
    .badge { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; background: rgba(139,92,246,0.2); color: #c4b5fd; border: 0.5px solid rgba(139,92,246,0.35); border-radius: 20px; padding: 3px 10px; margin-top: 8px; }

    .body { padding: 24px 28px; }
    .row-group { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
    .field { background: #111113; border: 0.5px solid #2e2e2e; border-radius: 8px; padding: 12px 14px; }
    .field.full { grid-column: 1 / -1; }
    .label { display: flex; align-items: center; gap: 7px; font-size: 10px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 6px; }
    .label i { font-size: 13px; color: #8b5cf6; }
    .value { font-size: 14px; color: #e0e0e0; line-height: 1.5; word-break: break-word; }
    .value a { color: #8b5cf6; text-decoration: none; }
    .message-text { font-size: 13px; color: #aaa; line-height: 1.8; }

    .meta { display: flex; align-items: center; gap: 10px; background: #111113; border: 0.5px solid #2e2e2e; border-radius: 8px; padding: 12px 14px; margin-top: 10px; }
    .meta i { font-size: 16px; color: #8b5cf6; }
    .meta-label { font-size: 11px; color: #666; }
    .meta-value { font-size: 13px; color: #e0e0e0; font-weight: 500; }

    .footer { padding: 14px 28px; border-top: 0.5px solid #2a2a2a; display: flex; justify-content: space-between; align-items: center; }
    .footer-left { font-size: 12px; color: #555; }
    .footer-right a { font-size: 12px; color: #8b5cf6; text-decoration: none; display: flex; align-items: center; gap: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-icon"><i class="ti ti-mail-forward"></i></div>
      <div class="header-text">
        <h1>New Contact Form Submission</h1>
        <p>Portfolio CMS &middot; Inbox notification</p>
        <span class="badge"><i class="ti ti-circle-filled" style="font-size:7px;"></i> 1 new message</span>
      </div>
    </div>

    <div class="body">
      <div class="row-group">
        <div class="field">
          <div class="label"><i class="ti ti-user"></i> From</div>
          <div class="value">${name}</div>
        </div>
        <div class="field">
          <div class="label"><i class="ti ti-mail"></i> Reply to</div>
          <div class="value"><a href="mailto:${email}">${email}</a></div>
        </div>
        <div class="field full">
          <div class="label"><i class="ti ti-tag"></i> Subject</div>
          <div class="value">${subject}</div>
        </div>
      </div>

      <div class="field full">
        <div class="label"><i class="ti ti-message-2"></i> Message</div>
        <div class="message-text">${message.replace(/\n/g, '<br>')}</div>
      </div>

      <div class="meta">
        <i class="ti ti-clock"></i>
        <div>
          <div class="meta-label">Received at</div>
          <div class="meta-value">${new Date().toLocaleString()}</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <span class="footer-left">Sent via <strong>Portfolio CMS</strong></span>
      <a href="${process.env.PORTFOLIO_URL || '#'}">
        Admin dashboard <i class="ti ti-arrow-right" style="font-size:13px;"></i>
      </a>
    </div>
  </div>
</body>
</html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: `[Portfolio Contact] ${subject}`,
      html: htmlContent,
      replyTo: email, // Allow direct reply to the sender
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent for contact from ${name} (${email})`);
  } catch (error) {
    // Silently log the error but do NOT throw
    // Email failures should never crash the contact route or return 500 to the user
    console.error('❌ Email notification failed:', {
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString(),
    });
    // Explicitly do not re-throw — this is intentional
  }
}

module.exports = { sendContactNotification };
