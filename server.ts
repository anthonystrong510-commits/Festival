import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 1. Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 2. SMTP Verification and Diagnostic endpoint
app.post('/api/test-smtp', async (req, res) => {
  const { host, port, secure, username, password, fromEmail, fromName, recipientEmail } = req.body || {};

  if (!host || !username) {
    return res.status(400).json({
      success: false,
      error: 'Missing required SMTP connection parameters (host, username).'
    });
  }

  const numericPort = Number(port) || (secure ? 465 : 587);
  const isSecure = Boolean(secure || numericPort === 465);

  const logs: string[] = [];
  logs.push(`[1/4] Establishing TCP socket to ${host}:${numericPort} (TLS: ${isSecure ? 'Direct SSL/TLS' : 'STARTTLS'})...`);

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: numericPort,
      secure: isSecure,
      auth: (username && password) ? {
        user: username,
        pass: password
      } : undefined,
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 12000,
      greetingTimeout: 10000,
      socketTimeout: 15000
    });

    logs.push(`[2/4] Verifying server handshake and greeting response...`);
    await transporter.verify();
    logs.push(`[3/4] SMTP server verified successfully! Authentication credentials accepted.`);

    let messageId: string | undefined;

    if (recipientEmail) {
      logs.push(`[4/4] Sending test verification email to ${recipientEmail}...`);
      const fromHeader = fromName ? `"${fromName}" <${fromEmail || username}>` : (fromEmail || username);

      const info = await transporter.sendMail({
        from: fromHeader,
        to: recipientEmail,
        replyTo: fromEmail || username,
        subject: `[SMTP Verified] Columbia Festival Mail Gateway Test`,
        text: `This is a live test email confirming your SMTP configuration is operational.\n\nHost: ${host}\nPort: ${numericPort}\nSender: ${fromHeader}\nTime: ${new Date().toUTCString()}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #f7f5ee; border-radius: 16px; border: 1px solid #e8e2d6;">
            <div style="background-color: #5A5A40; color: #ffffff; padding: 18px 24px; border-radius: 12px; margin-bottom: 20px;">
              <h2 style="margin: 0; font-size: 20px;">✓ SMTP Mailer Operational</h2>
              <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Columbia Community Vendor Marketplace</p>
            </div>
            <p style="font-size: 15px; color: #3d3a30; line-height: 1.6;">
              This test message confirms that your SMTP gateway is properly configured and successfully dispatching emails to live inboxes.
            </p>
            <div style="background: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #ded8c9; font-size: 13px; color: #555;">
              <div><strong>SMTP Host:</strong> ${host}</div>
              <div><strong>Port:</strong> ${numericPort} (${isSecure ? 'SSL/TLS' : 'STARTTLS'})</div>
              <div><strong>From Address:</strong> ${fromHeader}</div>
              <div><strong>Dispatched At:</strong> ${new Date().toISOString()}</div>
            </div>
          </div>
        `,
        headers: {
          'X-Mailer': 'Columbia-Festival-SMTP/1.0'
        }
      });

      messageId = info.messageId;
      logs.push(`[4/4] Test email successfully delivered! (Message-ID: ${info.messageId})`);
    } else {
      logs.push(`[4/4] Ready for outbound automated notifications.`);
    }

    return res.json({
      success: true,
      messageId,
      logs
    });
  } catch (error: any) {
    console.error('SMTP test error:', error);
    let errorMessage = error.message || 'SMTP Connection failed';
    if (error.code === 'EAUTH') {
      errorMessage = 'Authentication failed (EAUTH): Please check your SMTP username and password (for Gmail, generate an App Password).';
    } else if (error.code === 'ESOCKET' || error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      errorMessage = `Connection error (${error.code}): Could not connect to ${host}:${numericPort}. Verify the host address and port number.`;
    }

    logs.push(`[ERROR] ${errorMessage}`);

    return res.status(200).json({
      success: false,
      error: errorMessage,
      logs
    });
  }
});

// 3. Automated Outbound Email Dispatch Endpoint
app.post('/api/send-email', async (req, res) => {
  const {
    recipientEmail,
    recipientName,
    subject,
    htmlBody,
    plainText,
    templateKey,
    smtpConfig,
    festivalConfig
  } = req.body || {};

  if (!recipientEmail || !subject) {
    return res.status(400).json({
      success: false,
      error: 'recipientEmail and subject are required.'
    });
  }

  const host = smtpConfig?.host;
  const username = smtpConfig?.username;
  const password = smtpConfig?.password;
  const port = Number(smtpConfig?.port) || 587;
  const secure = Boolean(smtpConfig?.secure || port === 465);
  const fromEmail = smtpConfig?.fromEmail || username || 'organizer@columbiamarket.org';
  const fromName = smtpConfig?.fromName || festivalConfig?.name || 'Columbia Festival Market';
  const replyTo = smtpConfig?.replyToEmail || fromEmail;

  // If SMTP is provided with host and credentials, send over real SMTP
  if (host && username && password && smtpConfig?.isEnabled !== false) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user: username,
          pass: password
        },
        tls: {
          rejectUnauthorized: false
        },
        connectionTimeout: 12000,
        greetingTimeout: 10000,
        socketTimeout: 15000
      });

      const fromHeader = fromName ? `"${fromName}" <${fromEmail}>` : fromEmail;
      const toHeader = recipientName ? `"${recipientName}" <${recipientEmail}>` : recipientEmail;

      const info = await transporter.sendMail({
        from: fromHeader,
        to: toHeader,
        replyTo,
        subject,
        text: plainText,
        html: htmlBody,
        headers: {
          'X-Mailer': 'Columbia-Festival-Engine/1.0',
          'X-Template-Key': templateKey || 'general',
          'List-Unsubscribe': `<mailto:${replyTo}?subject=unsubscribe>`
        }
      });

      console.log(`[SMTP Sent] Email delivered to ${recipientEmail} via ${host} (ID: ${info.messageId})`);

      return res.json({
        success: true,
        messageId: info.messageId,
        status: 'delivered',
        method: 'smtp',
        info: {
          accepted: info.accepted,
          response: info.response
        }
      });
    } catch (smtpErr: any) {
      console.warn(`[SMTP Dispatch Warning] Failed to send via ${host} (${smtpErr.message}). Recording log and fallback...`);
      return res.status(200).json({
        success: false,
        status: 'failed',
        method: 'smtp',
        error: smtpErr.message || 'SMTP delivery rejected by host'
      });
    }
  }

  // Fallback if SMTP is not fully configured (e.g. initial demo without credentials)
  console.log(`[Email Dispatch Logged] To: ${recipientEmail} | Subject: "${subject}" (SMTP credentials not yet entered in admin)`);
  return res.json({
    success: true,
    messageId: `sim-${Date.now().toString(36)}`,
    status: 'simulated',
    method: 'simulated',
    note: 'Email rendered and logged. To send live to real inboxes, configure your SMTP host & password in /kingadmin.'
  });
});

// 4. Vite Middleware / Production Static serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
