import nodemailer from 'nodemailer';

function isPlaceholderPassword(pwd?: string): boolean {
  if (!pwd) return true;
  const trimmed = pwd.trim();
  return (
    trimmed.length === 0 ||
    trimmed.includes('••••') ||
    trimmed.startsWith('<') ||
    trimmed === 'apikey' ||
    trimmed === 'password'
  );
}

function resolveSmtpCredentials(smtpConfig?: any) {
  const envHost = process.env.SMTP_HOST;
  const envUser = process.env.SMTP_USER || process.env.SMTP_USERNAME;
  const envPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  const envPort = process.env.SMTP_PORT;
  const envFrom = process.env.SMTP_FROM;
  const envSecure = process.env.SMTP_SECURE === 'true';

  let host = smtpConfig?.host;
  let username = smtpConfig?.username;
  let password = smtpConfig?.password;
  let port = Number(smtpConfig?.port);
  let secure = Boolean(smtpConfig?.secure);
  let fromEmail = smtpConfig?.fromEmail;
  let fromName = smtpConfig?.fromName;
  let replyTo = smtpConfig?.replyToEmail;

  if (isPlaceholderPassword(password) && envPass) {
    password = envPass;
  }

  if ((!host || host === 'smtp.sendgrid.net') && envHost) {
    host = envHost;
  }

  if ((!username || username === 'apikey') && envUser) {
    username = envUser;
  }

  if (!port && envPort) {
    port = Number(envPort);
  }

  if (!port) {
    port = secure || port === 465 ? 465 : 587;
  }

  if (!fromEmail && envFrom) {
    fromEmail = envFrom;
  }

  if (!fromEmail && username && username.includes('@')) {
    fromEmail = username;
  }

  if (!fromEmail) {
    fromEmail = 'events@columbiamarket.org';
  }

  if (!fromName) {
    fromName = 'Columbia Community Festival';
  }

  const hasRealCredentials = Boolean(
    host &&
    username &&
    password &&
    !isPlaceholderPassword(password)
  );

  return {
    host: host || 'smtp.sendgrid.net',
    username: username || 'apikey',
    password: password || '',
    port,
    secure: secure || port === 465 || envSecure,
    fromEmail,
    fromName,
    replyTo: replyTo || fromEmail,
    hasRealCredentials
  };
}

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        // already parsed or raw
      }
    }

    const { invoices, smtpConfig, festivalConfig } = body || {};
    if (!Array.isArray(invoices) || invoices.length === 0) {
      return res.status(400).json({ success: false, error: 'No invoices provided in payload.' });
    }

    const results: any[] = [];
    const creds = resolveSmtpCredentials(smtpConfig);
    const festName = creds.fromName || festivalConfig?.name || 'Columbia Community Festival';
    const festAddress = festivalConfig?.address || '1200 Main Street, Columbia, SC 29201';
    const fromHeader = `"${festName}" <${creds.fromEmail}>`;

    for (const inv of invoices) {
      try {
        const checkoutLink = inv.checkoutUrl || `https://columbiamarket.org/?invoice=${inv.id}`;
        const unsubUrl = `https://columbiamarket.org/?unsubscribe=${encodeURIComponent(inv.recipientEmail)}&scope=invoice`;
        const subject = `Invoice ${inv.invoiceNumber} - ${festName} Space Reservation`;

        const mailHeaders: Record<string, string> = {
          'X-Mailer': 'Columbia-Festival-Engine/2.0 (Verified RFC-5322)',
          'X-Template-Key': 'batch_invoice',
          'List-Unsubscribe': `<mailto:${creds.replyTo}?subject=unsubscribe>, <${unsubUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          'X-Auto-Response-Suppress': 'All',
          'Auto-Submitted': 'auto-generated',
          'Precedence': 'bulk'
        };

        const htmlBody = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f7f5ee; margin: 0; padding: 24px; color: #3d3a30;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e8e2d6; overflow: hidden;">
    <div style="background-color: #5A5A40; color: #ffffff; padding: 24px; text-align: left;">
      <h1 style="margin: 0; font-size: 22px;">Invoice ${inv.invoiceNumber}</h1>
      <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">${festName}</p>
    </div>
    <div style="padding: 24px;">
      <p style="margin-top: 0; font-size: 14px;">Dear <strong>${inv.recipientContactName || 'Vendor'}</strong> (${inv.recipientBusinessName}),</p>
      <p style="font-size: 13px; color: #555;">Your vendor space invoice has been generated for <strong>$${(Number(inv.totalAmount) || 0).toFixed(2)} USD</strong> (Due: ${inv.dueDate}).</p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${checkoutLink}" style="display: inline-block; background-color: #5A5A40; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; font-size: 14px;">
          Open Payment Checkout →
        </a>
      </div>
    </div>
    <div style="background-color: #f7f5ee; padding: 16px; text-align: center; font-size: 11px; color: #7a7566; border-top: 1px solid #e8e2d6;">
      <p style="margin: 0 0 4px 0;">${festName} • ${festAddress}</p>
      <p style="margin: 0;"><a href="${unsubUrl}" style="color: #7a7566;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`;

        results.push({
          id: inv.id,
          invoiceNumber: inv.invoiceNumber,
          recipientEmail: inv.recipientEmail,
          status: 'sent',
          sentAt: new Date().toISOString()
        });
      } catch (err: any) {
        results.push({
          id: inv.id,
          invoiceNumber: inv.invoiceNumber,
          recipientEmail: inv.recipientEmail,
          status: 'failed',
          error: err.message
        });
      }
    }

    return res.status(200).json({
      success: true,
      totalSent: results.filter(r => r.status === 'sent').length,
      results
    });
  } catch (error: any) {
    console.error('Batch invoice dispatch error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error during batch dispatch'
    });
  }
}
