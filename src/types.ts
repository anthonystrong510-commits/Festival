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

export interface OutboundEmailLog {
  id?: string;
  recipientEmail: string;
  recipientName: string;
  templateKey: string;
  subject: string;
  plainText?: string;
  htmlBody?: string;
  renderedHtml?: string;
  renderedPlain?: string;
  status: 'delivered' | 'simulated' | 'failed' | 'pending';
  antiSpamScore: number;
  sentAt?: string;
  previewUrl?: string;
  method?: string;
  error?: string;
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
  previewUrl?: string;
  method?: string;
  error?: string;
}

export interface PaymentMethodsEnabled {
  usdt: boolean;
  ethereum: boolean;
  bitcoin: boolean;
  cashApp: boolean;
  kraken?: boolean;
  krakenPay?: boolean;
  bankTransfer: boolean;
}

export interface InvoiceBankDetails {
  bankName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankRoutingNumber?: string;
  bankSwiftBic?: string;
  zelleHandle?: string;
  paymentInstructions?: string;
}

export interface PaymentConfig {
  id?: string;
  // Stablecoin & On-chain Crypto
  usdtTrc20: string;
  usdtErc20: string;
  usdtSolana: string;
  usdtEnabled?: boolean;
  ethereumAddress: string;
  ethereumEns?: string;
  ethereumEnabled?: boolean;
  bitcoinAddress: string;
  bitcoinLightning?: string;
  bitcoinEnabled?: boolean;
  // Sponsors
  cashAppCashtag: string;
  cashAppBtcAddress?: string;
  cashAppEnabled: boolean;
  krakenPayId: string;
  krakenDepositAddress?: string;
  krakenPayEnabled?: boolean;
  krakenSponsorBadgeEnabled: boolean;
  // Traditional Rails
  bankTransferEnabled?: boolean;
  bankName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankRoutingNumber?: string;
  bankSwiftBic?: string;
  zelleHandle?: string;
  paymentInstructions?: string;
  updatedAt?: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category?: 'booth_fee' | 'electrical' | 'water' | 'equipment' | 'sponsorship' | 'discount' | 'other';
}

export interface InvoicePaymentSubmission {
  method: 'usdt_trc20' | 'usdt_erc20' | 'usdt_solana' | 'eth' | 'btc' | 'cashapp' | 'kraken' | 'bank_wire' | 'zelle' | 'other';
  txHash?: string;
  payerWalletOrHandle?: string;
  network?: string;
  paidAmount: number;
  paidCurrency: string;
  submittedAt: string;
  proofNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface InvoiceCryptoAddresses {
  usdtTrc20?: string;
  usdtErc20?: string;
  usdtSolana?: string;
  ethereumAddress?: string;
  ethereumEns?: string;
  bitcoinAddress?: string;
  bitcoinLightning?: string;
  cashAppCashtag?: string;
  cashAppBtcAddress?: string;
  krakenPayId?: string;
  krakenDepositAddress?: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'under_review' | 'overdue' | 'cancelled';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendorApplicationId?: string;
  recipientBusinessName: string;
  recipientContactName: string;
  recipientEmail: string;
  recipientPhone?: string;
  recipientAddress?: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceLineItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  currency: string;
  notes?: string;
  terms?: string;
  cryptoAddresses?: InvoiceCryptoAddresses;
  paymentMethodsEnabled?: PaymentMethodsEnabled;
  bankDetails?: InvoiceBankDetails;
  paymentDetailsSubmitted?: InvoicePaymentSubmission;
  sentAt?: string;
  paidAt?: string;
  checkoutUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CryptoTreasuryAsset {
  symbol: 'USDT' | 'ETH' | 'BTC';
  network: string;
  name: string;
  address: string;
  balance: number;
  priceUsd: number;
  valueUsd: number;
  change24h: number;
  explorerUrl: string;
  qrData?: string;
  isMockSync?: boolean;
}

export interface CryptoTreasuryOverview {
  totalUsdValue: number;
  totalUsdt: number;
  totalEth: number;
  totalBtc: number;
  lastUpdated: string;
  assets: CryptoTreasuryAsset[];
}

export type AdminTab = 
  | 'dashboard' 
  | 'applications' 
  | 'invoices'
  | 'payments'
  | 'attendees' 
  | 'booths' 
  | 'schedule' 
  | 'emails' 
  | 'smtp' 
  | 'settings';


