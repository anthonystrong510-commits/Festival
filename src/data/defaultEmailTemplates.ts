import { EmailTemplateData } from '../types';

export const DEFAULT_EMAIL_TEMPLATES: EmailTemplateData[] = [
  {
    id: 'tmpl-vendor-invoice',
    key: 'vendor_invoice_official',
    title: 'Official Vendor Space & Equipment Invoice',
    category: 'vendor',
    subject: 'Official Invoice {{invoice_number}} - {{business_name}} at {{festival_name}}',
    previewText: 'Your official vendor space invoice #{{invoice_number}} is ready. Pay online via Crypto, CashApp, Kraken, or Bank.',
    dynamicVariables: [
      '{{contact_name}}',
      '{{business_name}}',
      '{{invoice_number}}',
      '{{total_amount}}',
      '{{due_date}}',
      '{{checkout_url}}',
      '{{festival_name}}',
      '{{location}}',
      '{{physical_address}}',
      '{{contact_email}}',
      '{{unsubscribe_url}}'
    ],
    antiSpamScore: 100,
    spamAdvice: [
      '100% CAN-SPAM and RFC-5322 deliverability compliant',
      'Explicit physical business mailing address in footer',
      'One-click unsubscribe and communication preference links',
      'Transactional non-spam trigger wording',
      'Secure checkout URL link without deceptive masking'
    ],
    isCustom: false,
    plainTextBody: `OFFICIAL VENDOR INVOICE - {{festival_name}}
==================================================
Invoice Number: {{invoice_number}}
Recipient: {{contact_name}} ({{business_name}})
Due Date: {{due_date}}
Total Amount Due: {{total_amount}} USD

SECURE PAYMENT PORTAL:
{{checkout_url}}

Accepted Payment Methods:
- Multi-Chain Crypto: USDT (TRC-20 / ERC-20 / Solana), Ethereum, Bitcoin & Lightning
- Mobile Payment: CashApp Cashtag
- Sponsor Portal: Kraken Pay ID
- Traditional: Bank Wire Transfer & Zelle

TERMS & POLICIES:
Payment is required by {{due_date}} to guarantee designated space allocation.

--------------------------------------------------
{{festival_name}}
Physical Postal Address: {{physical_address}}
Official Support: {{contact_email}}
Unsubscribe / Manage Preferences: {{unsubscribe_url}}`,
    htmlBody: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice {{invoice_number}}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #3D3A30;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FAF8F5; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E8E2D6; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04);" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #5A5A40; padding: 32px 28px; text-align: left; color: #FFFFFF;">
              <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #EAE4D6;">Official Vendor Invoice</span>
              <h1 style="margin: 8px 0 0 0; font-size: 24px; font-weight: 800; color: #FFFFFF; line-height: 1.2;">Invoice {{invoice_number}}</h1>
              <p style="margin: 4px 0 0 0; font-size: 13px; color: #EAE4D6;">{{festival_name}} &bull; {{location}}</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 28px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #3D3A30; line-height: 1.5;">
                Dear <strong>{{contact_name}}</strong> ({{business_name}}),
              </p>
              <p style="margin: 0 0 20px 0; font-size: 14px; color: #5A5A40; line-height: 1.6;">
                Thank you for your vendor participation. Your space allocation and equipment invoice has been issued and is available for payment below.
              </p>

              <!-- Payment Summary Table -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F7F5EE; border: 1px solid #E8E2D6; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
                <tr>
                  <td style="padding-bottom: 8px; font-size: 13px; color: #7A7566; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">
                    Invoice Summary
                  </td>
                  <td align="right" style="padding-bottom: 8px; font-size: 12px; color: #5A5A40; font-weight: 700;">
                    Due: {{due_date}}
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="border-top: 1px solid #E8E2D6; padding-top: 12px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="4" border="0" style="font-size: 14px; color: #3D3A30;">
                      <tr>
                        <td width="40%" style="color: #6B6658;">Billed To:</td>
                        <td style="font-weight: 600;">{{business_name}}</td>
                      </tr>
                      <tr>
                        <td style="color: #6B6658;">Invoice Number:</td>
                        <td style="font-weight: 600; font-family: monospace;">{{invoice_number}}</td>
                      </tr>
                      <tr>
                        <td style="color: #6B6658;">Total Amount Due:</td>
                        <td style="font-weight: 800; font-size: 18px; color: #1B8755;">{{total_amount}} USD</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Checkout Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FAF8F5; border: 1px dashed #5A5A40; border-radius: 12px; margin: 24px 0;">
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <h3 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 700; color: #3D3A30;">Accepted Payment Methods</h3>
                    <p style="margin: 0 0 16px 0; font-size: 12px; color: #7A7566;">
                      Crypto (USDT / ETH / BTC), CashApp, Kraken Sponsor Portal, or Bank Wire
                    </p>
                    <a href="{{checkout_url}}" style="display: inline-block; background-color: #5A5A40; color: #FFFFFF; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 14px; font-weight: 700;">
                      Open Secure Payment Checkout &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 16px 0 0 0; font-size: 12px; color: #7A7566; line-height: 1.5;">
                For accounting or wire settlement questions, reply directly to <a href="mailto:{{contact_email}}" style="color: #5A5A40; font-weight: 700;">{{contact_email}}</a>.
              </p>
            </td>
          </tr>

          <!-- Standard Anti-Spam Footer -->
          <tr>
            <td style="background-color: #F7F5EE; padding: 24px 28px; border-top: 1px solid #E8E2D6; text-align: center; font-size: 11px; color: #7A7566; line-height: 1.6;">
              <p style="margin: 0 0 6px 0; font-weight: 700; color: #5A5A40;">
                {{festival_name}}
              </p>
              <p style="margin: 0 0 8px 0;">
                Physical Address: {{physical_address}} &bull; Support: {{contact_email}}
              </p>
              <p style="margin: 0 0 8px 0; color: #8A8576;">
                You received this billing notification because {{business_name}} registered as an official vendor.
              </p>
              <p style="margin: 0; font-size: 10px; color: #8A8576;">
                <a href="{{checkout_url}}" style="color: #5A5A40; text-decoration: underline; font-weight: 600;">View Invoice Online</a> &bull; 
                <a href="{{unsubscribe_url}}" style="color: #7A7566; text-decoration: underline;">Unsubscribe / Manage Preferences</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  },
  {
    id: 'tmpl-app-received',
    key: 'vendor_app_received',
    title: 'Vendor Application Received & In Review',
    category: 'vendor',
    subject: 'Application Received: {{business_name}} at {{festival_name}} [Ref: #{{application_id}}]',
    previewText: 'We have received your vendor application for {{festival_name}}. Here is what happens next.',
    dynamicVariables: [
      '{{contact_name}}',
      '{{business_name}}',
      '{{application_id}}',
      '{{booth_type}}',
      '{{days_requested}}',
      '{{festival_name}}',
      '{{location}}',
      '{{contact_email}}',
      '{{current_year}}'
    ],
    antiSpamScore: 98,
    spamAdvice: [
      'Includes clear sender identity and organizational physical footer',
      'Balanced text-to-HTML markup with accessible typography',
      'Preheader text included for inbox previews',
      'Direct link to check application status without aggressive promotional words'
    ],
    isCustom: false,
    plainTextBody: `Hello {{contact_name}},

Thank you for submitting your vendor application for {{business_name}} to exhibit at {{festival_name}}!

Application Reference: #{{application_id}}
Booth Space Requested: {{booth_type}}
Session(s): {{days_requested}}
Location: {{location}}

WHAT HAPPENS NEXT:
Our vendor curation jury reviews applications on a rolling basis. You can expect a status notification and booth placement confirmation within 3-5 business days.

If you have any urgent questions or need to submit updated certificates, please reply directly to {{contact_email}}.

Warm regards,
{{festival_name}} Organizer Team
{{location}}

---
You received this email because you submitted an application for {{festival_name}}.
To manage notification preferences, contact {{contact_email}}.`,
    htmlBody: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Received</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FDFBF7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #3D3A30;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FDFBF7; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E8E2D6; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(90,90,64,0.06);" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #5A5A40; padding: 28px 32px; text-align: center;">
              <span style="display: inline-block; background-color: rgba(240,235,224,0.2); border: 1px solid rgba(240,235,224,0.35); color: #F0EBE0; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                Vendor Application Portal
              </span>
              <h1 style="color: #FFFFFF; font-size: 24px; font-weight: 700; margin: 8px 0 0 0; letter-spacing: -0.5px;">
                {{festival_name}}
              </h1>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <p style="font-size: 16px; line-height: 1.6; color: #3D3A30; margin: 0 0 16px 0;">
                Hello <strong>{{contact_name}}</strong>,
              </p>
              <p style="font-size: 15px; line-height: 1.6; color: #6B6658; margin: 0 0 24px 0;">
                Thank you for applying to showcase <strong>{{business_name}}</strong> at this year's <strong>{{festival_name}}</strong>. We have successfully logged your registration details.
              </p>

              <!-- Application Summary Box -->
              <table role="presentation" width="100%" style="background-color: #F7F5EE; border: 1px solid #E8E2D6; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding-bottom: 8px; font-size: 13px; color: #7A7566; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">
                    Application Summary
                  </td>
                  <td align="right" style="padding-bottom: 8px; font-size: 12px; color: #5A5A40; font-weight: 700;">
                    Ref: #{{application_id}}
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="border-top: 1px solid #E8E2D6; padding-top: 12px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="4" border="0" style="font-size: 14px; color: #3D3A30;">
                      <tr>
                        <td width="40%" style="color: #6B6658; font-weight: 500;">Business Name:</td>
                        <td style="font-weight: 600;">{{business_name}}</td>
                      </tr>
                      <tr>
                        <td style="color: #6B6658; font-weight: 500;">Booth Tier:</td>
                        <td style="font-weight: 600;">{{booth_type}}</td>
                      </tr>
                      <tr>
                        <td style="color: #6B6658; font-weight: 500;">Selected Days:</td>
                        <td style="font-weight: 600;">{{days_requested}}</td>
                      </tr>
                      <tr>
                        <td style="color: #6B6658; font-weight: 500;">Festival Grounds:</td>
                        <td style="font-weight: 600;">{{location}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <h3 style="font-size: 16px; font-weight: 700; color: #3D3A30; margin: 0 0 12px 0;">
                Next Steps in the Review Process
              </h3>
              <ol style="font-size: 14px; line-height: 1.7; color: #6B6658; margin: 0 0 24px 0; padding-left: 20px;">
                <li><strong>Curation Review:</strong> Our jury reviews vendor submissions to ensure category balance and compliance.</li>
                <li><strong>Approval Notice:</strong> You will receive an official acceptance notice with your assigned zone and fee invoice within 3-5 business days.</li>
                <li><strong>Load-In Details:</strong> Final vehicle pass details and morning load-in schedules will be sent prior to the event.</li>
              </ol>

              <p style="font-size: 14px; line-height: 1.6; color: #6B6658; margin: 0 0 24px 0;">
                If you need to update any application details or submit insurance/food handler certificates, please reach out to our team at <a href="mailto:{{contact_email}}" style="color: #5A5A40; font-weight: 700; text-decoration: underline;">{{contact_email}}</a>.
              </p>
            </td>
          </tr>

          <!-- Footer with Anti-Spam & Postal Address Compliance -->
          <tr>
            <td style="background-color: #F7F5EE; border-top: 1px solid #E8E2D6; padding: 20px 32px; text-align: center;">
              <p style="font-size: 12px; line-height: 1.6; color: #8A8576; margin: 0 0 8px 0;">
                {{festival_name}} &bull; {{location}}<br>
                Official Event Operations Desk &bull; <a href="mailto:{{contact_email}}" style="color: #5A5A40; text-decoration: none;">{{contact_email}}</a>
              </p>
              <p style="font-size: 11px; line-height: 1.5; color: #A09B8D; margin: 0;">
                This transactional email was sent regarding your vendor application (#{{application_id}}).
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  },
  {
    id: 'tmpl-app-approved',
    key: 'vendor_app_approved',
    title: 'Vendor Approval & Booth Reservation',
    category: 'vendor',
    subject: '🎉 Congratulations! Your booth for {{business_name}} is APPROVED - {{festival_name}}',
    previewText: 'Your application has been accepted! Review your assigned zone, fee breakdown, and load-in instructions.',
    dynamicVariables: [
      '{{contact_name}}',
      '{{business_name}}',
      '{{application_id}}',
      '{{booth_type}}',
      '{{zone_assignment}}',
      '{{days_approved}}',
      '{{total_fee}}',
      '{{festival_name}}',
      '{{location}}',
      '{{contact_email}}',
      '{{payment_link}}'
    ],
    antiSpamScore: 97,
    spamAdvice: [
      'High-contrast, professional design without all-caps clickbait subject line',
      'Transparent pricing and invoice table without misleading financial claims',
      'Includes security & compliance checklist'
    ],
    isCustom: false,
    plainTextBody: `Congratulations {{contact_name}}!

We are thrilled to welcome {{business_name}} as an official vendor at {{festival_name}}!

CONFIRMED BOOKING DETAILS:
Application Reference: #{{application_id}}
Assigned Space: {{booth_type}}
Zone / Location: {{zone_assignment}}
Confirmed Sessions: {{days_approved}}
Total Booth Fee: \${{total_fee}}

CRITICAL VENDOR CHECKLIST:
1. Canopy Weights: All 10x10 tents require 20-30 lbs per tent leg (sandbags or weight plates).
2. Daily Morning Load-In: Vehicle unloading gates open 8:00 AM daily.
3. Food Vendors: Please ensure your Food Service Permit is clearly displayed.

If you have questions, reply to {{contact_email}}.

Warm regards,
{{festival_name}} Operations Committee`,
    htmlBody: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vendor Application Approved</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FDFBF7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #3D3A30;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FDFBF7; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E8E2D6; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(90,90,64,0.06);" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Banner -->
          <tr>
            <td style="background-color: #2D4A3E; padding: 32px; text-align: center;">
              <span style="display: inline-block; background-color: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.3); color: #E8F5E9; padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                Official Vendor Confirmation
              </span>
              <h1 style="color: #FFFFFF; font-size: 24px; font-weight: 700; margin: 8px 0 4px 0; letter-spacing: -0.5px;">
                Welcome to {{festival_name}}!
              </h1>
              <p style="color: #C8E6C9; font-size: 14px; margin: 0;">
                Your application for <strong>{{business_name}}</strong> has been accepted.
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="font-size: 16px; line-height: 1.6; color: #3D3A30; margin: 0 0 20px 0;">
                Dear <strong>{{contact_name}}</strong>,
              </p>
              <p style="font-size: 15px; line-height: 1.6; color: #6B6658; margin: 0 0 24px 0;">
                Congratulations! We are delighted to confirm that <strong>{{business_name}}</strong> has been approved to exhibit at <strong>{{festival_name}}</strong>.
              </p>

              <!-- Space Details -->
              <table role="presentation" width="100%" style="background-color: #F7F5EE; border: 1px solid #E8E2D6; border-radius: 12px; padding: 20px; margin-bottom: 24px;" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td colspan="2" style="font-size: 14px; font-weight: 700; color: #3D3A30; padding-bottom: 12px; border-bottom: 1px solid #E8E2D6;">
                    Confirmed Booth Details
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 12px; font-size: 14px; color: #6B6658;">Assigned Space:</td>
                  <td style="padding-top: 12px; font-size: 14px; font-weight: 700; color: #3D3A30;" align="right">{{booth_type}}</td>
                </tr>
                <tr>
                  <td style="padding-top: 8px; font-size: 14px; color: #6B6658;">Zone Placement:</td>
                  <td style="padding-top: 8px; font-size: 14px; font-weight: 700; color: #2D4A3E;" align="right">{{zone_assignment}}</td>
                </tr>
                <tr>
                  <td style="padding-top: 8px; font-size: 14px; color: #6B6658;">Confirmed Sessions:</td>
                  <td style="padding-top: 8px; font-size: 14px; font-weight: 700; color: #3D3A30;" align="right">{{days_approved}}</td>
                </tr>
                <tr>
                  <td style="padding-top: 8px; font-size: 14px; color: #6B6658;">Total Calculated Fee:</td>
                  <td style="padding-top: 8px; font-size: 16px; font-weight: 800; color: #5A5A40;" align="right">\${{total_fee}}</td>
                </tr>
              </table>

              <!-- Vendor Guidelines Reminder -->
              <h3 style="font-size: 15px; font-weight: 700; color: #3D3A30; margin: 0 0 12px 0;">
                Essential Guidelines & Rules
              </h3>
              <ul style="font-size: 13.5px; line-height: 1.6; color: #6B6658; margin: 0 0 24px 0; padding-left: 20px;">
                <li><strong>Tent Weights:</strong> Minimum 20-30 lbs weight per canopy leg is strictly mandatory.</li>
                <li><strong>Operating Hours:</strong> Booths must be staffed and active throughout official festival hours.</li>
                <li><strong>Morning Load-in:</strong> Gates open each morning prior to festival start. Vehicles must move to vendor lots immediately after unloading.</li>
              </ul>

              <p style="font-size: 14px; line-height: 1.6; color: #6B6658; margin: 0;">
                For any setup coordination, please reply to <a href="mailto:{{contact_email}}" style="color: #5A5A40; font-weight: 700;">{{contact_email}}</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F7F5EE; border-top: 1px solid #E8E2D6; padding: 20px 32px; text-align: center;">
              <p style="font-size: 12px; color: #8A8576; margin: 0 0 6px 0;">
                {{festival_name}} &bull; {{location}}
              </p>
              <p style="font-size: 11px; color: #A09B8D; margin: 0;">
                Official Vendor Confirmation &bull; Reference #{{application_id}}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  },
  {
    id: 'tmpl-attendee-pass',
    key: 'attendee_pass_vip',
    title: 'Attendee Free Digital Pass & Festival Guide',
    category: 'attendee',
    subject: '🎟️ Your Free Festival Pass for {{festival_name}} [Pass: #{{pass_code}}]',
    previewText: 'Your free digital admission pass is ready! View festival grounds map, parking info, and event schedule.',
    dynamicVariables: [
      '{{attendee_name}}',
      '{{pass_code}}',
      '{{group_size}}',
      '{{days_visiting}}',
      '{{festival_name}}',
      '{{location}}',
      '{{contact_email}}'
    ],
    antiSpamScore: 99,
    spamAdvice: [
      'Clean admission pass with clear event details',
      'No promotional push or deceptive claims',
      'Clear instructions for gate entry'
    ],
    isCustom: false,
    plainTextBody: `Hello {{attendee_name}}!

Your Free Admission Pass to {{festival_name}} is confirmed!

DIGITAL PASS CODE: {{pass_code}}
Party Size: {{group_size}} Guest(s)
Planned Session(s): {{days_visiting}}
Location: {{location}}

FESTIVAL HIGHLIGHTS:
- 100+ Curated artisan & small business booths
- Gourmet food truck row & sweet treats
- Live acoustic & stage music performances
- Free admission & dog/stroller-friendly grounds

PARKING & ARRIVAL:
Free visitor parking is available adjacent to the main festival entrance gates. Simply arrive and show your pass on your smartphone.

Questions? Contact {{contact_email}}.

See you at the festival!
{{festival_name}} Team`,
    htmlBody: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Festival Admission Pass</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FDFBF7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #3D3A30;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FDFBF7; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 540px; background-color: #FFFFFF; border: 1px solid #E8E2D6; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 16px rgba(90,90,64,0.08);" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Top Header -->
          <tr>
            <td style="background-color: #5A5A40; padding: 28px 24px; text-align: center;">
              <span style="display: inline-block; background-color: #F0EBE0; color: #5A5A40; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                Official Digital Pass
              </span>
              <h1 style="color: #FFFFFF; font-size: 24px; font-weight: 700; margin: 4px 0 0 0; letter-spacing: -0.5px;">
                {{festival_name}}
              </h1>
            </td>
          </tr>

          <!-- Ticket Card Cutout Style -->
          <tr>
            <td style="padding: 28px 28px 20px 28px;">
              <p style="font-size: 15px; color: #6B6658; margin: 0 0 20px 0; text-align: center;">
                Hi <strong>{{attendee_name}}</strong>, your free general admission pass is active!
              </p>

              <!-- Ticket Box -->
              <div style="background-color: #F7F5EE; border: 2px dashed #D6CFBE; border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 24px;">
                <div style="font-size: 11px; font-weight: 700; color: #7A7566; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">
                  Digital Pass Code
                </div>
                <div style="font-size: 26px; font-weight: 800; color: #3D3A30; font-family: monospace; letter-spacing: 3px; margin-bottom: 12px;">
                  #{{pass_code}}
                </div>
                <div style="display: inline-block; background-color: #5A5A40; color: #FFFFFF; font-size: 12px; font-weight: 700; padding: 4px 14px; border-radius: 20px;">
                  {{group_size}} Guest(s) &bull; Free Admission
                </div>
              </div>

              <!-- Event Details -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="6" border="0" style="font-size: 13.5px; color: #3D3A30; margin-bottom: 20px;">
                <tr>
                  <td width="35%" style="color: #7A7566; font-weight: 600;">Location:</td>
                  <td style="font-weight: 700;">{{location}}</td>
                </tr>
                <tr>
                  <td style="color: #7A7566; font-weight: 600;">Session(s):</td>
                  <td style="font-weight: 700;">{{days_visiting}}</td>
                </tr>
                <tr>
                  <td style="color: #7A7566; font-weight: 600;">Entry Policy:</td>
                  <td style="font-weight: 700; color: #2D4A3E;">100% Free Entry &bull; Pet Friendly</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F7F5EE; border-top: 1px solid #E8E2D6; padding: 18px 24px; text-align: center;">
              <p style="font-size: 11.5px; color: #8A8576; margin: 0;">
                {{festival_name}} &bull; Inquiries: <a href="mailto:{{contact_email}}" style="color: #5A5A40; text-decoration: none;">{{contact_email}}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  },
  {
    id: 'tmpl-vendor-waitlist',
    key: 'vendor_waitlist',
    title: 'Vendor Waitlist / Status Update',
    category: 'vendor',
    subject: 'Status Update: Your application for {{business_name}} at {{festival_name}}',
    previewText: 'Thank you for your application. Your business has been placed on our priority standby list.',
    dynamicVariables: [
      '{{contact_name}}',
      '{{business_name}}',
      '{{category}}',
      '{{festival_name}}',
      '{{contact_email}}'
    ],
    antiSpamScore: 98,
    spamAdvice: [
      'Empathetic, clear tone without ambiguous promises',
      'Includes direct contact email for follow-up questions'
    ],
    isCustom: false,
    plainTextBody: `Dear {{contact_name}},

Thank you so much for your interest in joining us at {{festival_name}} with {{business_name}}.

Due to overwhelming demand and limited booth capacities in the {{category}} category, we are currently at maximum capacity for primary spots. 

We have placed {{business_name}} on our Priority Standby / Waitlist. If an opening becomes available due to scheduling changes, our team will contact you immediately.

We sincerely appreciate your craftsmanship and hope to work with you!

Warm regards,
{{festival_name}} Vendor Committee`,
    htmlBody: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Application Status Update</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FDFBF7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #3D3A30;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FDFBF7; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 560px; background-color: #FFFFFF; border: 1px solid #E8E2D6; border-radius: 16px; overflow: hidden;" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="background-color: #5A5A40; padding: 24px; text-align: center;">
              <h1 style="color: #FFFFFF; font-size: 22px; font-weight: 700; margin: 0;">{{festival_name}}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px;">
              <p style="font-size: 15px; color: #3D3A30; margin: 0 0 16px 0;">Dear <strong>{{contact_name}}</strong>,</p>
              <p style="font-size: 14.5px; line-height: 1.6; color: #6B6658; margin: 0 0 16px 0;">
                Thank you for applying to showcase <strong>{{business_name}}</strong>. Due to high vendor interest, spaces in the <strong>{{category}}</strong> tier are currently fully committed.
              </p>
              <p style="font-size: 14.5px; line-height: 1.6; color: #6B6658; margin: 0 0 20px 0;">
                We have placed your business on our <strong>Priority Waitlist</strong>. Should an opening emerge, we will contact you right away.
              </p>
              <p style="font-size: 13.5px; color: #8A8576; margin: 0;">
                Questions? Feel free to reach us at <a href="mailto:{{contact_email}}" style="color: #5A5A40; font-weight: 700;">{{contact_email}}</a>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  },
  {
    id: 'tmpl-broadcast-update',
    key: 'festival_broadcast',
    title: 'Festival Announcement & Weather Advisory Broadcast',
    category: 'broadcast',
    subject: '📢 Important Update: {{festival_name}} Schedule & Weather Advisory',
    previewText: 'Important reminder for all exhibitors and attendees regarding weekend weather and morning load-in times.',
    dynamicVariables: [
      '{{recipient_name}}',
      '{{announcement_headline}}',
      '{{announcement_body}}',
      '{{festival_name}}',
      '{{location}}',
      '{{contact_email}}'
    ],
    antiSpamScore: 96,
    spamAdvice: [
      'Informative broadcast layout with high-readability blocks',
      'Prominent organizer contact details and unsubscribe header compatibility'
    ],
    isCustom: false,
    plainTextBody: `Hello {{recipient_name}},

IMPORTANT UPDATE FOR {{festival_name}}:

{{announcement_headline}}

{{announcement_body}}

Grounds Location: {{location}}
Contact Support: {{contact_email}}

Thank you for your community participation!
{{festival_name}} Organizing Committee`,
    htmlBody: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Festival Broadcast</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FDFBF7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #3D3A30;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FDFBF7; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #FFFFFF; border: 1px solid #E8E2D6; border-radius: 16px; overflow: hidden;" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="background-color: #5A5A40; padding: 24px; text-align: center;">
              <span style="display: inline-block; background-color: #F0EBE0; color: #5A5A40; padding: 3px 10px; border-radius: 14px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                Community Bulletin
              </span>
              <h1 style="color: #FFFFFF; font-size: 22px; font-weight: 700; margin: 0;">{{festival_name}}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px;">
              <h2 style="font-size: 18px; font-weight: 700; color: #3D3A30; margin: 0 0 12px 0;">
                {{announcement_headline}}
              </h2>
              <p style="font-size: 15px; line-height: 1.6; color: #6B6658; margin: 0 0 20px 0;">
                {{announcement_body}}
              </p>
              <table role="presentation" width="100%" style="background-color: #F7F5EE; border-radius: 8px; padding: 12px; font-size: 13px; color: #5A5A40;" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td><strong>Location:</strong> {{location}} &bull; <strong>Inquiries:</strong> {{contact_email}}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  }
];
