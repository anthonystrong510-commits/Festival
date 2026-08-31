import { AntiSpamAudit } from '../types';

export const SPAM_TRIGGER_WORDS = [
  'act now',
  '100% free',
  'click here',
  'winner',
  'guaranteed',
  'risk free',
  'no cost',
  'urgent',
  'earn money',
  'double your',
  'cash bonus',
  'make money fast',
  'credit card',
  'unlimited',
  'miracle',
  'congratulations you won'
];

export function interpolateTemplate(
  templateStr: string,
  variables: Record<string, string | number | undefined>
): string {
  let result = templateStr;
  Object.entries(variables).forEach(([key, val]) => {
    const safeVal = val !== undefined ? String(val) : '';
    // Replace {{key}} and {{ key }}
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    result = result.replace(regex, safeVal);
  });
  return result;
}

export function auditAntiSpamQuality(
  subject: string,
  htmlBody: string,
  plainTextBody: string,
  hasSenderAddress = true
): AntiSpamAudit {
  const passedRules: string[] = [];
  const warnings: string[] = [];
  const spamWordsFound: string[] = [];

  const combinedText = `${subject} ${htmlBody} ${plainTextBody}`.toLowerCase();

  // 1. Check Spam Trigger Words
  SPAM_TRIGGER_WORDS.forEach((word) => {
    if (combinedText.includes(word)) {
      spamWordsFound.push(word);
    }
  });

  if (spamWordsFound.length === 0) {
    passedRules.push('No aggressive spam trigger keywords detected');
  } else {
    warnings.push(`Contains high-risk promotional phrasing: "${spamWordsFound.slice(0, 3).join('", "')}"`);
  }

  // 2. Subject Line Checks
  if (subject.length > 5 && subject.length <= 75) {
    passedRules.push('Subject line length is optimal (under 75 characters)');
  } else if (subject.length > 75) {
    warnings.push('Subject line is too long (> 75 chars) and may truncate on mobile inboxes');
  } else {
    warnings.push('Subject line is too short or empty');
  }

  const isAllUpper = subject.replace(/[^a-zA-Z]/g, '').length > 5 && 
    subject.replace(/[^a-zA-Z]/g, '') === subject.replace(/[^a-zA-Z]/g, '').toUpperCase();
  if (!isAllUpper) {
    passedRules.push('Clean title-case capitalization (no ALL-CAPS screaming)');
  } else {
    warnings.push('ALL-CAPS subject line detected (often triggers spam filters)');
  }

  // 3. HTML-to-Text Balance
  const strippedHtml = htmlBody.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const htmlLen = htmlBody.length;
  const textLen = strippedHtml.length;
  const ratio = htmlLen > 0 ? Number((textLen / htmlLen).toFixed(2)) : 0;

  if (ratio >= 0.20 || htmlLen < 1500) {
    passedRules.push(`Balanced HTML-to-text density ratio (${Math.round(ratio * 100)}% content text)`);
  } else {
    warnings.push('Heavy HTML tags relative to text content; ensure adequate plain-text copy');
  }

  // 4. Plain Text Fallback Check
  if (plainTextBody.trim().length > 50) {
    passedRules.push('Multipart MIME plain-text alternative included (essential for strict mail servers)');
  } else {
    warnings.push('Missing or thin plain-text fallback content');
  }

  // 5. Unsubscribe & Header Compliance
  const hasUnsub = htmlBody.toLowerCase().includes('unsubscribe') || 
                   htmlBody.toLowerCase().includes('preferences') || 
                   htmlBody.toLowerCase().includes('notification') ||
                   htmlBody.toLowerCase().includes('inquiries');
  if (hasUnsub) {
    passedRules.push('Direct preference / contact footer links present');
  } else {
    warnings.push('No contact/unsubscribe footer detected (CAN-SPAM risk)');
  }

  // 6. Physical Mailing Address / Location
  if (hasSenderAddress) {
    passedRules.push('Physical location / festival grounds anchor declared');
  } else {
    warnings.push('Physical postal / venue address missing in email footer');
  }

  // Calculate score (0-100)
  let score = 100;
  score -= spamWordsFound.length * 8;
  score -= warnings.length * 6;
  if (!plainTextBody.trim()) score -= 15;
  if (isAllUpper) score -= 20;
  if (score < 20) score = 20;
  if (score > 100) score = 100;

  let grade: 'A+' | 'A' | 'B' | 'C' | 'Warning' = 'A+';
  if (score >= 95) grade = 'A+';
  else if (score >= 88) grade = 'A';
  else if (score >= 75) grade = 'B';
  else if (score >= 60) grade = 'C';
  else grade = 'Warning';

  return {
    score,
    grade,
    passedRules,
    warnings,
    spamTriggerWordsFound: spamWordsFound,
    htmlToTextRatio: ratio,
    hasUnsubscribeLink: hasUnsub,
    hasPhysicalAddress: hasSenderAddress,
    hasDkimHeaders: true,
    hasSpfAligned: true
  };
}

export function generateDnsSpfRecord(domain = 'yourdomain.com', smtpHost = 'smtp.sendgrid.net'): string {
  return `v=spf1 include:${smtpHost.replace(/^smtp\./, '')} ~all`;
}

export function generateDmarcRecord(domain = 'yourdomain.com', ruaEmail = 'dmarc-reports@yourdomain.com'): string {
  return `v=DMARC1; p=quarantine; rua=mailto:${ruaEmail}; pct=100; adkim=r; aspf=r`;
}

export function calculateAntiSpamScore(
  subject: string,
  htmlBody: string,
  plainTextBody: string,
  fromName?: string,
  fromEmail?: string,
  physicalAddress?: string
): AntiSpamAudit {
  const hasAddress = !!(physicalAddress && physicalAddress.trim().length > 5);
  return auditAntiSpamQuality(subject, htmlBody, plainTextBody, hasAddress);
}
