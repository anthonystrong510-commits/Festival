import { 
  VendorApplicationRecord, 
  AttendeeRsvpRecord, 
  EmailTemplateData, 
  SmtpConfigData, 
  FestivalConfigData, 
  OutboundEmailLog 
} from '../types';
import { interpolateTemplate, calculateAntiSpamScore } from './antiSpamUtils';
import { DEFAULT_EMAIL_TEMPLATES } from '../data/defaultEmailTemplates';
import { 
  logOutboundEmail, 
  DEFAULT_FESTIVAL_CONFIG, 
  DEFAULT_SMTP_CONFIG,
  getSmtpConfigOnce,
  getFestivalConfigOnce,
  getEmailTemplateByKey
} from './firebase';

export interface SendEmailOptions {
  recipientEmail: string;
  recipientName: string;
  templateKey: string;
  variables: Record<string, string | number>;
  customTemplate?: EmailTemplateData;
  festivalConfig?: FestivalConfigData;
  smtpConfig?: SmtpConfigData;
  meta?: Record<string, any>;
}

export interface SendEmailResult {
  success: boolean;
  messageId: string;
  status: 'delivered' | 'simulated' | 'failed';
  subject: string;
  renderedHtml: string;
  renderedPlain: string;
  antiSpamScore: number;
  error?: string;
}

/**
 * Core Automated Email Dispatcher
 * Renders anti-spam compliant HTML and Plain Text templates, computes deliverability score,
 * and logs to Firestore for real-time admin monitoring.
 */
export async function sendAutomatedEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  let {
    recipientEmail,
    recipientName,
    templateKey,
    variables,
    customTemplate,
    festivalConfig,
    smtpConfig,
    meta = {}
  } = options;

  // Resolve active SMTP settings from Firestore if not explicitly passed
  if (!smtpConfig) {
    smtpConfig = await getSmtpConfigOnce();
  }

  // Resolve active Festival Configuration from Firestore if not explicitly passed
  if (!festivalConfig) {
    festivalConfig = await getFestivalConfigOnce();
  }

  // Resolve active Template from Firestore if not explicitly passed
  let template = customTemplate;
  if (!template) {
    const fetched = await getEmailTemplateByKey(templateKey);
    template = fetched || DEFAULT_EMAIL_TEMPLATES.find(t => t.key === templateKey) || DEFAULT_EMAIL_TEMPLATES[0];
  }

  // Merge default global variables with passed variables
  const mergedVariables: Record<string, string | number> = {
    festival_name: festivalConfig?.name || 'Columbia Festival Market',
    location: festivalConfig?.address || 'Columbia Event Grounds, Columbia, SC',
    venue_name: festivalConfig?.venueName || 'Columbia Event Grounds',
    contact_email: smtpConfig?.fromEmail || 'organizer@columbiamarket.org',
    current_year: new Date().getFullYear(),
    recipient_name: recipientName,
    ...variables
  };

  const renderedSubject = interpolateTemplate(template.subject, mergedVariables);
  const renderedHtml = interpolateTemplate(template.htmlBody, mergedVariables);
  const renderedPlain = interpolateTemplate(template.plainTextBody, mergedVariables);

  // Compute Anti-Spam deliverability grade
  const audit = calculateAntiSpamScore(
    renderedSubject,
    renderedHtml,
    renderedPlain,
    smtpConfig.fromName,
    smtpConfig.fromEmail,
    festivalConfig.address
  );

  const logId = `mail-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  let deliveryStatus: 'delivered' | 'simulated' | 'failed' = 'simulated';
  let serverMessageId = logId;
  let deliveryError: string | undefined;

  try {
    const apiRes = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipientEmail,
        recipientName,
        subject: renderedSubject,
        htmlBody: renderedHtml,
        plainText: renderedPlain,
        templateKey,
        smtpConfig,
        festivalConfig
      })
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data.status === 'delivered') {
        deliveryStatus = 'delivered';
        serverMessageId = data.messageId || logId;
      } else if (data.status === 'failed') {
        deliveryStatus = 'failed';
        deliveryError = data.error;
      } else {
        deliveryStatus = 'simulated';
      }
    }
  } catch (netErr: any) {
    console.warn('Network call to /api/send-email warning:', netErr);
  }

  const emailLog: OutboundEmailLog = {
    id: logId,
    recipientEmail,
    recipientName,
    templateKey,
    subject: renderedSubject,
    plainText: renderedPlain,
    htmlBody: renderedHtml,
    status: deliveryStatus,
    antiSpamScore: audit.score,
    sentAt: new Date().toISOString(),
    meta: {
      ...meta,
      fromEmail: smtpConfig?.fromEmail,
      fromName: smtpConfig?.fromName,
      host: smtpConfig?.host,
      smtpEnabled: smtpConfig?.isEnabled,
      smtpPort: smtpConfig?.port,
      smtpUsername: smtpConfig?.username,
      spfDnsRecord: smtpConfig?.spfRecord,
      serverMessageId,
      deliveryError
    }
  };

  try {
    await logOutboundEmail(emailLog);
  } catch (err) {
    console.warn('Could not write email log to Firestore (continuing delivery flow):', err);
  }

  return {
    success: deliveryStatus !== 'failed',
    messageId: serverMessageId,
    status: deliveryStatus,
    subject: renderedSubject,
    renderedHtml,
    renderedPlain,
    antiSpamScore: audit.score,
    error: deliveryError
  };
}

/**
 * Automatically trigger confirmation email when a Vendor Application is created
 */
export async function sendVendorApplicationReceivedEmail(
  app: VendorApplicationRecord,
  festivalConfig?: FestivalConfigData,
  smtpConfig?: SmtpConfigData
): Promise<SendEmailResult> {
  const daysFormatted = app.selectedDays
    .map(d => d.toUpperCase())
    .join(', ');

  const boothLabels: Record<string, string> = {
    'tent-10x10': '10x10 Standard Canopy Space',
    'tent-10x20': '10x20 Double Showcase Space',
    'table-artisan': '6ft Covered Artisan Table',
    'food-truck': 'Food Truck & Mobile Kitchen Bay',
    'farmers-stall': 'Fresh Produce & Floral Stall'
  };

  const boothDisplay = boothLabels[app.selectedBoothId] || app.selectedBoothId;

  return sendAutomatedEmail({
    recipientEmail: app.email,
    recipientName: app.contactName,
    templateKey: 'vendor_app_received',
    variables: {
      contact_name: app.contactName,
      business_name: app.businessName,
      application_id: app.id,
      booth_type: boothDisplay,
      days_requested: daysFormatted,
      total_fee: `$${app.totalCalculatedFee || 0}`,
      category: app.category,
    },
    festivalConfig,
    smtpConfig,
    meta: {
      type: 'vendor_submission',
      applicationId: app.id,
      businessName: app.businessName
    }
  });
}

/**
 * Automatically trigger VIP Free Pass confirmation email when an Attendee RSVPs
 */
export async function sendAttendeeRsvpConfirmationEmail(
  rsvp: AttendeeRsvpRecord,
  festivalConfig?: FestivalConfigData,
  smtpConfig?: SmtpConfigData
): Promise<SendEmailResult> {
  const daysFormatted = rsvp.daysAttending
    .map(d => d.toUpperCase())
    .join(', ');

  return sendAutomatedEmail({
    recipientEmail: rsvp.email,
    recipientName: rsvp.name,
    templateKey: 'attendee_pass_vip',
    variables: {
      attendee_name: rsvp.name,
      pass_code: rsvp.passCode,
      group_size: `${rsvp.groupSize}`,
      days_visiting: daysFormatted,
    },
    festivalConfig,
    smtpConfig,
    meta: {
      type: 'attendee_rsvp',
      rsvpId: rsvp.id,
      passCode: rsvp.passCode
    }
  });
}

/**
 * Trigger approval notification when organizer accepts vendor
 */
export async function sendVendorApprovalEmail(
  app: VendorApplicationRecord,
  zoneAssignment: string,
  festivalConfig?: FestivalConfigData,
  smtpConfig?: SmtpConfigData
): Promise<SendEmailResult> {
  const daysFormatted = app.selectedDays
    .map(d => d.toUpperCase())
    .join(', ');

  return sendAutomatedEmail({
    recipientEmail: app.email,
    recipientName: app.contactName,
    templateKey: 'vendor_app_approved',
    variables: {
      contact_name: app.contactName,
      business_name: app.businessName,
      application_id: app.id,
      booth_type: app.selectedBoothId,
      zone_assignment: zoneAssignment || app.boothZoneAssignment || 'Main Artisan Row',
      days_approved: daysFormatted,
      total_fee: `${app.totalCalculatedFee || 0}`,
      payment_link: `${window.location.origin}/portal/vendor/${app.id}`
    },
    festivalConfig,
    smtpConfig,
    meta: {
      type: 'vendor_approval',
      applicationId: app.id
    }
  });
}
