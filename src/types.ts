export type BoothId = 'food-truck' | 'tent-10x10' | 'tent-10x20' | 'corner-10x10' | 'extra-large-20x20';

export interface BoothTier {
  id: BoothId;
  name: string;
  category: 'FOOD' | 'BOOTH';
  pricePerDay: number;
  dimensions: string;
  tagline: string;
  description: string;
  popular?: boolean;
  featured?: boolean;
  bestFor: string;
  included: string[];
  capacityNote: string;
  badge?: string;
  zone: string;
  capacity?: number;
  soldOut?: boolean;
}

export interface FestivalDay {
  id: 'fri' | 'sat' | 'sun';
  dayName: string;
  shortDay: string;
  dateStr: string;
  hours: string;
  setupTime: string;
  title: string;
  highlights: string[];
  breakdownNotice: string;
}

export interface VendorFormData {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  category: string;
  selectedBoothId: BoothId;
  selectedDays: Array<'fri' | 'sat' | 'sun'>;
  productDescription: string;
  photoLinks: string;
  isFoodVendor: boolean;
  hasFoodPermit: boolean;
  tempHygieneCompliant: boolean;
  needsHandicapParking: boolean;
  handicapNotes: string;
  additionalRequests: string;
  agreedToTerms: boolean;
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'waitlist' | 'paid';

export interface VendorApplicationRecord extends VendorFormData {
  id: string;
  status: ApplicationStatus;
  totalCalculatedFee: number;
  boothZoneAssignment?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
  paymentStatus?: 'unpaid' | 'paid' | 'waived';
  invoiceNumber?: string;
}

export interface AttendeeFormData {
  name: string;
  email: string;
  daysAttending: string[];
  interests: string[];
  groupSize: number;
  newsletterOptIn: boolean;
}

export interface AttendeeRsvpRecord extends AttendeeFormData {
  id: string;
  passCode: string;
  checkedIn: boolean;
  checkedInAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ScheduleEvent {
  id: string;
  day: 'fri' | 'sat' | 'sun';
  time: string;
  title: string;
  location: string;
  description: string;
  type: 'entertainment' | 'food' | 'market' | 'workshop' | 'kids';
}

export interface MarketCategory {
  id: string;
  name: string;
  description: string;
  items: string[];
  image: string;
  iconName: string;
  vendorCountEstimate: string;
}

export interface VendorSpotlight {
  id: string;
  businessName: string;
  owner: string;
  category: string;
  bio: string;
  products: string;
  image: string;
  boothType: string;
  quote: string;
}

export interface FestivalConfigData {
  id?: string;
  name: string;
  shortName: string;
  heroHeadline: string;
  edition: string;
  tagline: string;
  description: string;
  venueName: string;
  venueArea: string;
  address: string;
  cityState: string;
  fullLocation: string;
  mapQuery: string;
  datesSummary: string;
  durationBadge: string;
  admissionBadge: string;
  locationBadge: string;
  contactEmail: string;
  freeAdmission: boolean;
  active: boolean;
  updatedAt?: string;
}

export interface EmailTemplateData {
  id: string;
  key: string;
  title: string;
  category: 'vendor' | 'attendee' | 'broadcast' | 'billing';
  subject: string;
  previewText: string;
  htmlBody: string;
  plainTextBody: string;
  dynamicVariables: string[];
  antiSpamScore: number;
  spamAdvice: string[];
  isCustom?: boolean;
  updatedAt?: string;
}

export interface SmtpConfigData {
  id?: string;
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password?: string;
  fromName: string;
  fromEmail: string;
  replyToEmail: string;
  rateLimitPerHour: number;
  spfRecord?: string;
  dkimSelector?: string;
  dmarcPolicy?: string;
  isEnabled: boolean;
  testStatus?: 'idle' | 'success' | 'failed' | 'testing';
  lastTestedAt?: string;
  updatedAt?: string;
}

export interface AntiSpamAudit {
  score: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'Warning';
  passedRules: string[];
  warnings: string[];
  spamTriggerWordsFound: string[];
  htmlToTextRatio: number;
  hasUnsubscribeLink: boolean;
  hasPhysicalAddress: boolean;
  hasDkimHeaders: boolean;
  hasSpfAligned: boolean;
}

export type AdminTab = 
  | 'dashboard' 
  | 'applications' 
  | 'attendees' 
  | 'booths' 
  | 'schedule' 
  | 'emails' 
  | 'smtp' 
  | 'settings';

