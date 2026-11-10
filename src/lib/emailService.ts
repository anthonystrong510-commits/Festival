import { 
  VendorApplicationRecord, 
  AttendeeRsvpRecord, 
  EmailTemplateData, 
  SmtpConfigData, 
  FestivalConfigData, 
  OutboundEmailLog,
  SendEmailResult,
  Invoice
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

import { safeFetchJson } from './apiUtils';

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

/**
 * Core Automated Email Dispatcher
 * Renders anti-spam compliant HTML and Plain Text templates, computes deliverability score,
 * dispatches via server SMTP or test mailer, and logs to Firestore for real-time admin monitoring.
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
    template = fetched || DEFAULT_EMAIL_TEMPLATES.find(t => t.key === templateKey || t.id === templateKey) || DEFAULT_EMAIL_TEMPLATES[0];
  }

  // Resolve active base and website URLs
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : (festivalConfig?.siteDomain || 'https://columbiamarket.org');
  const websiteUrl = festivalConfig?.websiteUrl || festivalConfig?.siteDomain || baseUrl;
  const unsubUrl = `${baseUrl}/?unsubscribe=${encodeURIComponent(recipientEmail)}&scope=all`;
  const prefUrl = `${baseUrl}/?unsubscribe=${encodeURIComponent(recipientEmail)}&tab=preferences`;
  const physicalAddr = festivalConfig?.address || 'Columbia Festival & Market Grounds, 1100 Lincoln St, Columbia, SC 29201, USA';
  const contactEmail = smtpConfig?.fromEmail || festivalConfig?.contactEmail || 'events@companydesk.online';

  // Merge default global variables with passed variables
  const mergedVariables: Record<string, string | number> = {
    festival_name: festivalConfig?.name || 'Columbia Festival Market',
    location: physicalAddr,
    venue_name: festivalConfig?.venueName || 'Columbia Event Grounds',
    contact_email: contactEmail,
    current_year: new Date().getFullYear(),
    recipient_name: recipientName,
    recipient_email: recipientEmail,
    website_url: websiteUrl,
    unsubscribe_url: unsubUrl,
    preferences_url: prefUrl,
    physical_address: physicalAddr,
    safe_sender_email: contactEmail,
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
  let deliveryStatus: 'delivered' | 'simulated' | 'failed' = 'delivered';
  let serverMessageId = logId;
  let previewUrl: string | undefined;
  let deliveryMethod = 'smtp';
  let deliveryError: string | undefined;

  try {
    const apiRes = await safeFetchJson('/api/send-email', {
      method: 'POST',
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

    if (apiRes.success) {
      deliveryStatus = 'delivered';
      serverMessageId = apiRes.messageId || logId;
      previewUrl = apiRes.previewUrl;
      deliveryMethod = apiRes.method || 'smtp';
    } else if (apiRes.error) {
      deliveryStatus = 'failed';
      deliveryError = apiRes.error;
    } else {
      deliveryStatus = 'delivered';
      deliveryMethod = 'simulated';
    }
  } catch (netErr: any) {
    console.warn('safeFetchJson call to /api/send-email warning:', netErr);
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
    previewUrl,
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
      deliveryMethod,
      previewUrl,
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
    previewUrl,
    method: deliveryMethod,
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

/**
 * Trigger official Payment Request & Invoice email to vendor applicant
 */
export async function sendPaymentRequestEmail(
  app: VendorApplicationRecord,
  invoice: Invoice,
  festivalConfig?: FestivalConfigData,
  smtpConfig?: SmtpConfigData
): Promise<SendEmailResult> {
  const checkoutUrl = invoice.checkoutUrl || `${window.location.origin}/?invoice=${invoice.id}`;
  const festAddress = festivalConfig?.address || 'Columbia Event Grounds, Columbia, SC';

  return sendAutomatedEmail({
    recipientEmail: app.email,
    recipientName: app.contactName,
    templateKey: 'vendor_invoice_official',
    variables: {
      contact_name: app.contactName,
      business_name: app.businessName,
      invoice_number: invoice.invoiceNumber,
      total_amount: `$${Number(invoice.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      due_date: invoice.dueDate,
      checkout_url: checkoutUrl,
      physical_address: festAddress,
      unsubscribe_url: `${window.location.origin}/?unsubscribe=${encodeURIComponent(app.email)}&scope=invoice`,
      application_id: app.id
    },
    festivalConfig,
    smtpConfig,
    meta: {
      type: 'vendor_payment_request',
      applicationId: app.id,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber
    }
  });
}

/**
 * Trigger Payment Confirmation & Official Booth Pass to vendor applicant
 */
export async function sendPaymentConfirmedEmail(
  app: VendorApplicationRecord,
  invoice: Invoice,
  festivalConfig?: FestivalConfigData,
  smtpConfig?: SmtpConfigData
): Promise<SendEmailResult> {
  const boothLabels: Record<string, string> = {
    'tent-10x10': '10x10 Standard Canopy Space',
    'tent-10x20': '10x20 Double Showcase Space',
    'table-artisan': '6ft Covered Artisan Table',
    'food-truck': 'Food Truck & Mobile Kitchen Bay',
    'farmers-stall': 'Fresh Produce & Floral Stall'
  };

  return sendAutomatedEmail({
    recipientEmail: app.email,
    recipientName: app.contactName,
    templateKey: 'vendor_payment_confirmed',
    variables: {
      contact_name: app.contactName,
      business_name: app.businessName,
      application_id: app.id,
      invoice_number: invoice.invoiceNumber,
      paid_amount: `$${Number(invoice.paidAmount || invoice.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      booth_zone: app.boothZoneAssignment || 'Main Artisan Row',
      booth_type: boothLabels[app.selectedBoothId] || app.selectedBoothId,
      current_year: new Date().getFullYear()
    },
    festivalConfig,
    smtpConfig,
    meta: {
      type: 'vendor_payment_confirmed',
      applicationId: app.id,
      invoiceId: invoice.id
    }
  });
}

/**
 * Trigger Waitlist notification to applicant
 */
export async function sendVendorWaitlistEmail(
  app: VendorApplicationRecord,
  festivalConfig?: FestivalConfigData,
  smtpConfig?: SmtpConfigData
): Promise<SendEmailResult> {
  return sendAutomatedEmail({
    recipientEmail: app.email,
    recipientName: app.contactName,
    templateKey: 'vendor_waitlist',
    variables: {
      contact_name: app.contactName,
      business_name: app.businessName,
      category: app.category,
      application_id: app.id
    },
    festivalConfig,
    smtpConfig,
    meta: {
      type: 'vendor_waitlist',
      applicationId: app.id
    }
  });
}

/**
 * Trigger custom message from organizer to applicant
 */
export async function sendCustomApplicantEmail(
  app: VendorApplicationRecord,
  customSubject: string,
  customMessageBody: string,
  festivalConfig?: FestivalConfigData,
  smtpConfig?: SmtpConfigData
): Promise<SendEmailResult> {
  return sendAutomatedEmail({
    recipientEmail: app.email,
    recipientName: app.contactName,
    templateKey: 'applicant_custom_message',
    variables: {
      contact_name: app.contactName,
      business_name: app.businessName,
      custom_subject: customSubject,
      custom_message_body: customMessageBody,
      application_id: app.id
    },
    festivalConfig,
    smtpConfig,
    meta: {
      type: 'custom_applicant_message',
      applicationId: app.id
    }
  });
}
